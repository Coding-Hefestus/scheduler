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
import { Builder } from 'builder-pattern';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public user: User;
  public selectedUser: User;
  public userForm: FormGroup;
  public mode: string;
  public disableRegister: boolean;
  public users: User[] = [];
  public role = '';

  constructor(private passingDataService : PassingDataService, private fb: FormBuilder, private router: Router, private userService: UserService, private tokenStorage : TokenStorageService) { }

  ngOnInit(): void {
    this.passingDataService.currentMode.subscribe(currentMode => {
      
      if (Mode.EDIT == currentMode){
        this.mode = 'edit';
        var u = this.tokenStorage.getUser()
        this.role = u.role;

        if (this.role == 'ADMIN'){
          this.userService.fetchAllRegularUsers().subscribe(users => {
            this.users = users;
          })
        } else {
          this.userService.fetchUser(u.id).subscribe(user => {
            this.user = user;
            this.initEditMode(this.user);
          })
          
        }
        
        

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

  public onUserSelected(selectedUser){
    this.user = selectedUser;
    this.initEditMode(this.user);
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
          var user = this.tokenStorage.getUser()
          if (user.role != 'ADMIN') {
              var editedUser = Builder(User).email(this.user.email).iat(user.iat).exp(user.exp).id(this.user.id).role(this.user.role).build();
              this.tokenStorage.saveUser(editedUser);
          }
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

  private initEditMode(user : User){
    this.userForm = this.fb.group({
      id:        [user['id'],        [ Validators.required]],
      firstname: [user['firstname'], [ Validators.minLength(3), Validator.cannotContainWhitespaceOnly]],
      lastname:  [user['lastname'],  [ Validators.required,     Validators.minLength(3), Validator.cannotContainWhitespaceOnly]],
      email:     [user['email'],     [ Validators.required,     Validators.email]],
      password:  [user['password'],  [ Validators.required,     Validators.minLength(1), Validator.cannotContainWhitespaceOnly]],
      username:  [user['username'],  [ Validators.required,     Validators.minLength(3), Validator.cannotContainWhitespaceOnly]],
      role:      [user['role'],      [ Validators.required,     Validators.minLength(3), Validator.cannotContainWhitespaceOnly]]
    });
  }
  private initLoginMode(){
    this.userForm = this.fb.group({
      password:  [this.user['password'],  [ Validators.required, Validator.cannotContainWhitespaceOnly]],
      username:  [this.user['username'],  [ Validators.required, Validator.cannotContainWhitespaceOnly]],
    });
  }

}
