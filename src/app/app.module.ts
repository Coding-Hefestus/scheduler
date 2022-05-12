import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { CourtComponent } from './components/court/court.component';
import { DatePipe } from './utils/date-pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './utils/material-module';
import { NgxStripeModule } from 'ngx-stripe';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './components/user/user.component';
import { ReservationComponent } from './components/reservation/reservation.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CourtComponent,
    DatePipe,
    UserComponent,
    ReservationComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    NgxStripeModule.forRoot('pk_test_51KrplgL8U3BNM2iQOPu9Y2SCV5j07e8d1oWbwrYwTe3wYc3QkFX1JlveVgBO0AB5ClKnsOxtHcZP3Re7lsE9nDIe00eP1g0G8G'),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
/*

  BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    NgxStripeModule.forRoot('pk_test_51KrplgL8U3BNM2iQOPu9Y2SCV5j07e8d1oWbwrYwTe3wYc3QkFX1JlveVgBO0AB5ClKnsOxtHcZP3Re7lsE9nDIe00eP1g0G8G'),
    ReactiveFormsModule
    */
