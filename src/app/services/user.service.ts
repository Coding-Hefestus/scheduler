import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API = 'http://localhost:8081/api/user-service';

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
}
