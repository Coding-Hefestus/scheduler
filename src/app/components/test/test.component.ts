import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  public filterDateFrom: Date;
  date: string;
    constructor() {
        this.date = new Date().toISOString().slice(0, 16);
    }
  ngOnInit(): void {
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
}
