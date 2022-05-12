import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Builder } from 'builder-pattern';
import { Court } from 'src/app/model/court';
import { CourtInfo } from 'src/app/model/court-info';
import { ReservationByCourtAndUser } from 'src/app/model/reservationByCourtAndUser';
import { User } from 'src/app/model/user';
import { CourtService } from 'src/app/services/court.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  //helper variables
  public isAdmin: boolean;
  public selectedUser: User;
  public selectedCourt: CourtInfo;
  public users: User[] = [];
  public courts: CourtInfo[] = [];
  public reservationsByCourtAndUser: ReservationByCourtAndUser[] = [];




  constructor(private router: Router, private http: HttpClient,  private courtService: CourtService, private userService: UserService) { }

  ngOnInit(): void {

    //call local-storge service, to check for role
    this.isAdmin = true;

    if(this.isAdmin){
      this.userService.fetchAllRegularUsers().subscribe(users => {
        this.users = users;
      })

      this.courtService.fetchCourtsList().subscribe(data =>{
        this.courts = data;
      })
    } else {
      //call fetch user by id, local storage for getting id
      this.userService.fetchUser(1).subscribe(user => {
        this.selectedUser = user;
      })
    }
  }

  public onUserSelected(selectedUser){
    this.selectedUser = selectedUser;
    console.log(JSON.stringify(this.selectedUser))
    if (this.selectedCourt){
      this.fetchData();
    }
  }

  public onCourtSelected(selectedCourt){
    this.selectedCourt = selectedCourt;
    console.log(JSON.stringify(this.selectedCourt))
    if (this.selectedUser){
      this.fetchData();
    }
  }

  private fetchData(){
    this.courtService.reservationByCourtAndUser(this.selectedUser.id, this.selectedCourt.id).subscribe(data => {
      this.reservationsByCourtAndUser = data
    })
  }

  public removeReservation(index : number, reservationId : number){

    this.courtService.deleteReservation(reservationId).subscribe(res => {
      if (res['reason']){
        alert(res['reason'])
        this.reservationsByCourtAndUser.splice(index, 1);
      }
    })


  }


}
