import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mode } from 'src/app/model/mode';
import { PassingDataService } from 'src/app/services/passing-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  //helper variables
  public userId : number; // this will be taken from local storage
 

  constructor(private passingDataService : PassingDataService) {

   }

  ngOnInit(): void {
   
    this.userId = 1; //fetch from local-storage
  }

  public notifyUserComponent(){
     //inform UserComponent about opening Mode
     this.passingDataService.changeMode(Mode.EDIT);
  }

 
  
}
