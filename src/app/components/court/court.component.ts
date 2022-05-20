import { Component, Inject, OnInit } from '@angular/core';
import { Builder } from 'builder-pattern';
import { Timeslot } from 'src/app/model/timeslot';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StripeService } from 'ngx-stripe';
import {StripeElementsOptions,PaymentRequestPaymentMethodEvent,PaymentIntent,PaymentRequestShippingAddressEvent} from '@stripe/stripe-js';
import { DOCUMENT, JsonPipe } from '@angular/common';
import {loadStripe} from '@stripe/stripe-js';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  StripePaymentElementComponent } from 'ngx-stripe';
import { ActivatedRoute, Router } from '@angular/router';
import { CourtService } from 'src/app/services/court.service';
import { Court } from 'src/app/model/court';
import { ReservationRequest } from 'src/app/model/reservation-request';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { TokenStorageService } from 'src/app/services/token-storag.service';


@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.css']
})
export class CourtComponent implements OnInit {

  //stripe elements
  @ViewChild(StripePaymentElementComponent)
  public paymentElement: StripePaymentElementComponent;
  public stripeForm : FormGroup;
  public paymentTypeForm: FormGroup;
  public elementsOptions: StripeElementsOptions = {locale: 'en'};
 
  //user's data, to be taken from jwt (session storage) [id, roles]
  public loggedInUser : User;
  public userRole = '';
 

  //helper variables
  public paymentType: string;
  public startDate: Date;
  public endDate: Date;
  public paymentIntentExists: boolean;
  public successButton: boolean;
  public errorButton: boolean;
  public outcomeText: string;
  public court: Court;
  public reservationMessage: string;
  public selectedUser: User;
  public recentlyMadeTimeslots: any[] = [];
  public recentlyMadeReservationUser: string;

  //timeslots and users repository
  public timeslots: Timeslot[] = []; 
  public users: User[] = [];

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, 
              private router: Router, @Inject(DOCUMENT) private document: Document, 
              private http: HttpClient, private stripeService: StripeService, 
              private courtService: CourtService, private userService: UserService,
              private rxStompService: RxStompService,
              private tokenStorageService : TokenStorageService) { 
  }



  ngOnInit(): void {
    //init Stripe
    loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

    //init user
    this.loggedInUser = this.tokenStorageService.getUser();
    if (this.loggedInUser) this.userRole = this.loggedInUser.role;
    

    //initialize paymentTypeForm [cash or card]
    this.paymentTypeForm = this.fb.group({'type': 1});
    
    //default payment type
    this.paymentType = 'cash';

    //init Court's data
    var courtId = this.activatedRoute.snapshot.queryParamMap.get('court')
    this.courtService.fetchCourtData(courtId).subscribe(court => {
        this.court = court;

        if (this.loggedInUser && this.userRole == 'USER'){
           //initialize form for user's data
           this.stripeForm = this.fb.group({
             name: [this.loggedInUser, [Validators.required, Validators.minLength(3)]],
             amount: new FormControl({value: 0, disabled: true}, [Validators.required, Validators.min(this.court.price)]),
             email: [this.loggedInUser.email, [Validators.email, Validators.required]]
           });
        } 
        
        
        else {
          this.stripeForm = this.fb.group({
            name: [this.loggedInUser, [Validators.required, Validators.minLength(3)]],
            amount: new FormControl({value: 0, disabled: true}, [Validators.required, Validators.min(this.court.price)]),
            email: ['', [Validators.email, Validators.required]]
          });
        }
        
        
    })

    //if role is admin, load regular users
    if (this.userRole == 'ADMIN'){
      this.userService.fetchAllRegularUsers().subscribe(users => {
        this.users = users;
      })
    }

    this.rxStompService.watch('/scheduler/reservation-event').subscribe((message: Message) => {
      console.log("iz /scheduler/reservation-event: " + message.body);
        var event = JSON.parse(message.body)
        if (this.court.courtId === event['courtId']){
          this.recentlyMadeTimeslots = event['reservationDtos'];
          console.log(this.recentlyMadeTimeslots)
          this.recentlyMadeReservationUser = event['username'];
        }
       
    });
    
    
  }

  public onUserSelected(selectedUser){
    this.selectedUser = selectedUser;
    this.stripeForm.controls['email'].setValue(this.selectedUser.email)
  }

  // Show a spinner on payment submission
  public setLoading(isLoading) {
    if (isLoading) {
      // Disable the button and show a spinner
      (document.querySelector("#paymentButton")  as HTMLButtonElement).disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
    } else {
      (document.querySelector("#paymentButton")  as HTMLButtonElement).disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
    }
  }

  changePaymentTypeToCash(){
    this.paymentType = 'cash';
  }

  changePaymentTypeToCard(){
    this.paymentType = 'card';
  }

  private createPaymentIntent(amount: number): Observable<any> {
    return this.http.post<any>(
      `http://localhost:9001/stripe/create-payment-intent`,
      { amount : amount }
    );
  }

  public removeTimeslote(index : number){
    this.outcomeText = null;
    this.resetPaymentIntent()
    if (this.timeslots.length == 0) return;
    this.timeslots.splice(index, 1);
    this.stripeForm.controls['amount'].setValue(this.timeslots.length * this.court.price)

  }

  public addTimeslot(){
    this.outcomeText = null;
    if (this.startDate == null || this.startDate== undefined || this.endDate == null || this.endDate == undefined){
      alert("Start and end date must be valid for a given timeslot!");
      return;
    }  
    this.resetPaymentIntent()
    this.timeslots.push(Builder(Timeslot).start(this.startDate.getTime().toString()).end(this.endDate.getTime().toString()).build())
    this.stripeForm.controls['amount'].setValue(this.timeslots.length * this.court.price)
  }
  
  public resetPaymentIntent(){
    this.elementsOptions =  {locale: 'en'};
    this.paymentIntentExists = false;
  }

  public fetchPaymentIntent(){
    this.setLoading(true);
    this.createPaymentIntent(this.stripeForm.get('amount')!.value)
    .subscribe(clientSecretResponse => {
      console.log("payment intent: " + clientSecretResponse.clientSecret)
      this.elementsOptions.clientSecret = clientSecretResponse.clientSecret;
      this.paymentIntentExists = true;
      this.setLoading(false);
    });
  }

 

  public dateChangedStart(eventDate: string): Date | null {
    this.startDate = new Date(eventDate.toString())
    return !!eventDate ? new Date(eventDate) : null;
  }

  public dateChangedEnd(eventDate: string): Date | null {
    this.endDate = new Date(eventDate.toString())
    return !!eventDate ? new Date(eventDate) : null;
  }

  public payByCash(){
    var request = Builder(ReservationRequest)
    .courtId(this.court.courtId).paymentMethod('CASH')
    .total(this.stripeForm.controls['amount'].value)
    .reservationDtos(this.timeslots).user(this.selectedUser != null ? this.selectedUser['id'] : this.loggedInUser['id'])
    .build();

    this.courtService.makeReservations(request).subscribe(response => {
      if (!response.hasErrorMessage){
        this.outcomeText = response.successMessage;
      } else this.outcomeText = response.errorMessage;
    })
  }

  public pay(success : string){
    if (this.stripeForm.valid) {
      this.setLoading(true);
      this.stripeService.confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: this.stripeForm.get('name')!.value,
              email: this.stripeForm.get('email')!.value
            }
          }
        },
        redirect: 'if_required'
      }).subscribe(result => {
        this.setLoading(false);
        console.log('Result', result);
        if (result.error) {

          if (result.error.type !== 'validation_error'){
            // Show error to your customer (e.g., insufficient funds, card was declined)
            this.outcomeText = 'Payment failed! Reason: ' + result.error.message + ' Click here to reload page.'
            this.errorButton = true; this.successButton = false;
            this.paymentIntentExists = true;
            this.elementsOptions = {locale: 'en'}
           
          }
        

        } else {
          // The payment has been processed!
          if (result.paymentIntent!.status === 'succeeded') {
            //show a success message to your customer
            this.outcomeText = 'You have successfully paid your order! Click here to go to home page.'
            this.errorButton = false; this.successButton = true;
            this.paymentIntentExists = true;
            this.elementsOptions = {locale: 'en'}
            //success mesage from BE is displyied underneath timeslots
            this.outcomeText = success;
          }
        }
      });
    } else {
      console.log(this.stripeForm);
    }
  }

  public payByCard(){
    var request = Builder(ReservationRequest)
    .paymentIntent(this.elementsOptions.clientSecret)
    .total(this.stripeForm.controls['amount'].value)
    .courtId(this.court.courtId).paymentMethod('CARD')
    .reservationDtos(this.timeslots).user(this.selectedUser != null ? this.selectedUser.id : 2).build();

    this.courtService.makeReservations(request).subscribe(response => {
      if (!response.hasErrorMessage){
        //if BE reservations are okay (no overalaps with other timeslots and timeslots are in future etc...), only then we call Stripe
        this.pay(response.successMessage);
      } else this.outcomeText = response.errorMessage;
    })
  }

  public reloadPage(){
    window.location.reload();
  }

  public goToHomePage(){
    this.router.navigate(["/tennis-scheduler"]);
  }

}
