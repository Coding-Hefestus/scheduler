import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Mode } from 'src/app/model/mode';
import { User } from 'src/app/model/user';
import { PassingDataService } from 'src/app/services/passing-data.service';
import { TokenStorageService } from 'src/app/services/token-storag.service';
import { UserService } from 'src/app/services/user.service';
import { Validator } from 'src/app/utils/validator';
//import * as jwt_decode from 'jwt-decode';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public user: User;
  public userForm: FormGroup;
  public mode: string;
  public disableRegister: boolean;

  constructor(private passingDataService : PassingDataService, private fb: FormBuilder, private router: Router, private userService: UserService, private tokenStorage : TokenStorageService) { }

  ngOnInit(): void {
    this.passingDataService.currentMode.subscribe(currentMode => {
      
      if (Mode.EDIT == currentMode){
        this.mode = 'edit';
        var userId = 1 //make call to local-storage to extract id
        this.userService.fetchUser(userId).subscribe(user => {
          this.user = user;
          
          this.initEditMode();
        })

      } else if (Mode.REGISTER == currentMode){
        this.mode = 'register';
        this.user = new User();
        this.initRegisterMode();

      } else if (Mode.LOGIN == currentMode){
        this.mode = 'login';
        this.user = new User()
        this.initLoginMode();
      }

    });
  }

  public submitFormRegister(){
    this.user.password = this.userForm.get('password').value;
    this.user.username = this.userForm.get('username').value;
    this.user.email = this.userForm.get('email').value;
    this.userService.registerUser(this.user).subscribe(user => {
      this.disableRegister = true;
      if (user){
        alert("You have successfully registerd!")
      } else {
        alert("Server error!")
      }
      this.router.navigate(["/tennis-scheduler"]);
    })
  }

  public submitFormLogin(){
    this.user.password = this.userForm.get('password').value;
    this.user.username = this.userForm.get('username').value;
    this.userService.login(this.user).subscribe(res => {
        console.log(res)
        if(res['jwt']){
          atob
          var decodedUser = JSON.parse(window.atob(res['jwt'].split('.')[1]));
          this.tokenStorage.saveUser(decodedUser);
          this.tokenStorage.saveToken(res['jwt']);
          this.passingDataService.triggerLoginEvent();
          this.router.navigate(['/tennis-scheduler']);
        } else{
          alert("Incorrect username or password.")
        }

      
    })
  }

  public submitFormEdit(){
    this.user.firstname = this.userForm.get('firstname').value;
    this.user.lastname = this.userForm.get('lastname').value;
    this.user.password = this.userForm.get('password').value;
    this.user.username = this.userForm.get('username').value;
    this.user.email = this.userForm.get('email').value;
    this.user.role = this.userForm.get('role').value;
    
    this.userService.editUser(this.user).subscribe(user => {
      if (user){
        alert("You have successfully edited user profile!")
      } else {
        alert("Server error!")
      }
    })

  }

  private initRegisterMode(){
    this.userForm = this.fb.group({
      email:     [this.user['email'],     [ Validators.required,     Validators.email]],
      password:  [this.user['password'],  [ Validators.required,     Validators.minLength(1), Validator.cannotContainWhitespaceOnly]],
      username:  [this.user['username'],  [ Validators.required,     Validators.minLength(3), Validator.cannotContainWhitespaceOnly]]
    });
  }

  private initEditMode(){
    this.userForm = this.fb.group({
      id:        [this.user['id'],        [ Validators.required]],
      firstname: [this.user['firstname'], [ Validators.minLength(3), Validator.cannotContainWhitespaceOnly]],
      lastname:  [this.user['lastname'],  [ Validators.required,     Validators.minLength(3), Validator.cannotContainWhitespaceOnly]],
      email:     [this.user['email'],     [ Validators.required,     Validators.email]],
      password:  [this.user['password'],  [ Validators.required,     Validators.minLength(1), Validator.cannotContainWhitespaceOnly]],
      username:  [this.user['username'],  [ Validators.required,     Validators.minLength(3), Validator.cannotContainWhitespaceOnly]],
      role:      [this.user['role'],      [ Validators.required,     Validators.minLength(3), Validator.cannotContainWhitespaceOnly]]
    });
  }
  private initLoginMode(){
    this.userForm = this.fb.group({
      password:  [this.user['password'],  [ Validators.required, Validator.cannotContainWhitespaceOnly]],
      username:  [this.user['username'],  [ Validators.required, Validator.cannotContainWhitespaceOnly]],
    });
  }

}
