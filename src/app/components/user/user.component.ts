import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mode } from 'src/app/model/mode';
import { User } from 'src/app/model/user';
import { PassingDataService } from 'src/app/services/passing-data.service';
import { UserService } from 'src/app/services/user.service';
import { Validator } from 'src/app/utils/validator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public user: User;
  public userForm: FormGroup;

  constructor(private passingDataService : PassingDataService, private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.passingDataService.currentMode.subscribe(currentMode => {

      //console.log("from UserComponent: " + currentMode)

      if (Mode.EDIT == currentMode){
        var userId = 1 //make call to local-storage to extract id
        this.userService.fetchUser(userId).subscribe(user => {
          this.user = user;
        })

      } else if (Mode.REGISTER == currentMode){

      } else if (Mode.LOGIN == currentMode){

      }

    });
  }

  private initEditMode(){
    this.userForm = this.fb.group({
      id:        [this.user['id'],        [ Validators.required]],
      firstname: [this.user['firstname'], [ Validators.minLength(3), Validator.cannotContainWhitespaceOnly]],
      lastname:  [this.user['lastname'],  [ Validators.minLength(3), Validator.cannotContainWhitespaceOnly]],
      email:     [this.user['email'],     [ Validators.required,     Validators.email]],
      lozinka:   [this.user['password'],  [ Validators.required,     Validators.minLength(3), Validator.cannotContainWhitespaceOnly]],
      username:  [this.user['username'],  [ Validators.required,     Validators.minLength(3), Validator.cannotContainWhitespaceOnly]]
      /*
    id!: number
    firstname!: string
    lastname!: string
    email!: string
    password!: string
    username!: string
    role!: string
      */
    })
  }

}
