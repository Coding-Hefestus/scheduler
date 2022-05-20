import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storag.service';

@Injectable()
export class AuthGuard implements CanActivate, Resolve<void> {

  constructor(private tokenService: TokenStorageService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.tokenService.isLoggedIn()) {
      return true;
    }
    else {
      this.router.navigate(['tennis-scheduler']);
      return false;
    }
  }

  resolve(){
    console.log("iz auth guarda: " + this.tokenService.isLoggedIn())
    if (this.tokenService.isLoggedIn()) this.router.navigate(['tennis-scheduler'])
  }
}