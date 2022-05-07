import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { Court } from '../model/court';

@Injectable({
  providedIn: 'root'
})
export class CourtService {

  private readonly API = 'http://localhost:8080/api/scheduler-service';

  constructor(private http: HttpClient) { }

  public fetchCourtInfo() : Observable<Court[]> {
    // /fetch'
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(this.API + '/courts-info', { headers })
    .pipe(map((res: any) => {
      
      
      return res;

    }), catchError(error => {
      if (error.status === 400) {
        return null;
      }
      else {
        return null; //Observable.throw(error.json().error || 'Server error');
      }
    }));
  };
}
