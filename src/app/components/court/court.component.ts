import { Component, Inject, OnInit } from '@angular/core';
import { Builder } from 'builder-pattern';
import { Timeslot } from 'src/app/model/timeslot';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StripeService } from 'ngx-stripe';
import {StripeElementsOptions,PaymentRequestPaymentMethodEvent,PaymentIntent,PaymentRequestShippingAddressEvent} from '@stripe/stripe-js';
import { DOCUMENT } from '@angular/common';
import {loadStripe} from '@stripe/stripe-js';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  StripePaymentElementComponent } from 'ngx-stripe';


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
  public elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };
 
  //user's data
  public loggedInUser = "Pera Peric";
  public loggedInUserEmail = "pera@gmail.com";

  //dummy amount for pricing
  public amount = 12;

  //helper variables
  public startDate: Date;
  public endDate: Date;

  //helper timeslots
  public timeslots: Timeslot[] = [Builder(Timeslot).start("1650914076517").end("1650914076517").build()];

  constructor(private fb: FormBuilder, @Inject(DOCUMENT) private document: Document, private http: HttpClient, private stripeService: StripeService) { 


  }



  ngOnInit(): void {
    //init Stripe
    loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

    //initialize paymentTypeForm
    this.paymentTypeForm = this.fb.group({
      'type': 1
    });

    //initialize form for user's data
    this.stripeForm = this.fb.group({
      name: [this.loggedInUser, [Validators.required, Validators.minLength(3)]],
      amount: new FormControl({value: this.amount, disabled: true}, [Validators.required, Validators.min(0)]),
      email: [this.loggedInUserEmail, [Validators.email, Validators.required]],
    });
   
    //to be moved once user hits 'Pay' and if 'Card' is selected
    this.createPaymentIntent(this.stripeForm.get('amount')!.value)
    .subscribe(clientSecretResponse => {
      console.log("aaaaaaaaaaaaa: " + clientSecretResponse.clientSecret)
      this.elementsOptions.clientSecret = clientSecretResponse.clientSecret;
    
    });
  }

  changePaymentTypeToCash(){
     console.log("menjam u cash")
  }

  changePaymentTypeToCard(){
    console.log("menjam u card")
  }

  private createPaymentIntent(amount: number): Observable<any> {
    return this.http.post<any>(
      `http://localhost:8080/create-payment-intent`,
      { amount : amount }
    );
  }

  public pay(){
    if (this.stripeForm.valid) {
      this.stripeService.confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: this.stripeForm.get('name')!.value
            }
          }
        },
        redirect: 'if_required'
      }).subscribe(result => {
        console.log('Result', result);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
          if (result.paymentIntent!.status === 'succeeded') {
            // Show a success message to your customer
            alert({ success: true });
          }
        }
      });
    } else {
      console.log(this.stripeForm);
    }
  }

  public removeTimeslote(index : number){
    this.timeslots.splice(index, 1);
  }

  public addTimeslot(){
    this.timeslots.push(Builder(Timeslot).start(this.startDate.getTime().toString()).end(this.endDate.getTime().toString()).build())
  }

  public dateChangedStart(eventDate: string): Date | null {
    this.startDate = new Date(eventDate.toString())
    return !!eventDate ? new Date(eventDate) : null;
  }

  public dateChangedEnd(eventDate: string): Date | null {
    this.endDate = new Date(eventDate.toString())
    return !!eventDate ? new Date(eventDate) : null;
  }

}
