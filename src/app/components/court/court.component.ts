import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Builder } from 'builder-pattern';
import { Timeslot } from 'src/app/model/timeslot';

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.css']
})
export class CourtComponent implements OnInit {
  //paymentForm: FormGroup;
  paymentForm : FormControl;
  public startDate: Date;
  public endDate: Date;
  public timeslots: Timeslot[] = [Builder(Timeslot).start("1650914076517").end("1650914076517").build()];
  constructor(public fb: FormBuilder) { }

  model = {
    left: true,
    middle: false,
    right: false
  };

  ngOnInit(): void {
    // this.paymentForm = this.fb.group({
    //   korisnickoIme: ['CARD'],
    //   lozinka:       ['CASH' ]p
    // })
    this.paymentForm = new FormControl();
  }

  public removeTimeslote(index : number){
    this.timeslots.splice(index, 1);
  }

  public addTimeslot(){
    this.timeslots.push(Builder(Timeslot).start(this.startDate.getTime().toString()).end(this.endDate.getTime().toString()).build())
  }

  public dateChangedStart(eventDate: string): Date | null {
    //console.log(eventDate)
    this.startDate = new Date(eventDate.toString())

    return !!eventDate ? new Date(eventDate) : null;
  }

  public dateChangedEnd(eventDate: string): Date | null {
    //console.log(eventDate)
    this.endDate = new Date(eventDate.toString())
    return !!eventDate ? new Date(eventDate) : null;
  }

}
