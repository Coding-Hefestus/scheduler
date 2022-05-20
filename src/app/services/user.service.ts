import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API = 'http://localhost:9001/api/user-service'

  constructor(private http: HttpClient) { }

  public fetchAllRegularUsers() : Observable<User[]> {
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(this.API + '/users', { headers })
    .pipe(map((res: any) => {
      return res;
    }), catchError(error => {
      if (error.status === 400) {
        return null;
      }
      else {
        return null;
      }
    }));
  };

  public fetchUser(userId: number) : Observable<User> {
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(this.API + '/user/'+userId, { headers })
    .pipe(map((res: any) => {
      return res;
    }), catchError(error => {
      if (error.status === 400) {
        return null;
      }
      else {
        return null;
      }
    }));
  };

  public editUser(user: User) : Observable<User> {
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.API + '/user/', user, { headers })
    .pipe(map((res: any) => {
      return res;
    }), catchError(error => {
      if (error.status === 400) {
        return null;
      }
      else {
        return null;
      }
    }));
  };

  public registerUser(user: User) : Observable<User> {
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.API + '/register', user, { headers })
    .pipe(map((res: any) => {
      return res;
    }), catchError(error => {
      if (error.status === 400) {
        return null;
      }
      else {
        return null;
      }
    }));
  };

  public login(user: User) : Observable<any> { //LoginRespons
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.API + '/login', user, { headers })
    .pipe(map((res: any) => {
      return res;
    }), catchError(error => {
      if (error.status === 400) {
        return null;
      }
      else {
        return null;
      }
    }));
  };
}
