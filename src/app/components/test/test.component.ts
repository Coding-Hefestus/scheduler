import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  public filterDateFrom: Date;
  public radioGroupForm: FormGroup;
  date: string;
    constructor(private http: HttpClient, private fb: FormBuilder) {
        this.date = new Date().toISOString().slice(0, 16);
    }
  ngOnInit(): void {
     this.radioGroupForm = this.fb.group({
      'type': 1
    });
  }
  public myFunction() {
    var x = document.getElementById("myLocalDate");
    console.log(x)
    //document.getElementById("demo").innerHTML = x;
  }

  dateChanged(eventDate: string): Date | null {
    //console.log(eventDate)
    var x = new Date(eventDate.toString())
    console.log(x.getTime())
    return !!eventDate ? new Date(eventDate) : null;
  }

  

  private createPaymentIntent(amount: number): Observable<number> {
    return this.http.post<number>(
      `http://localhost:8080/create-payment-intent`,
      { amount : amount }
    );
  }
}
