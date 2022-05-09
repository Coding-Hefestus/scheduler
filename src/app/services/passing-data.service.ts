import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Mode } from '../model/mode';

@Injectable({
  providedIn: 'root'
})
export class PassingDataService {

  userModeSource = new BehaviorSubject<Mode>(null)
  currentMode = this.userModeSource.asObservable();

  constructor() { }

  changeMode(mode: Mode){
    this.userModeSource.next(mode);
  }
}
