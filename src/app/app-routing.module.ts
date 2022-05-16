import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourtManagementComponent } from './components/court-management/court-management.component';
import { CourtComponent } from './components/court/court.component';
import { HomeComponent } from './components/home/home.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { TestComponent } from './components/test/test.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  {path: '', redirectTo:'home', pathMatch: 'full' },
  {path: 'tennis-scheduler', component: HomeComponent},
  {path: 'tennis-scheduler/overview', component: CourtComponent},
  {path: 'profile/:userIdPlaceholder', component: UserComponent},
  {path: 'reservations', component: ReservationComponent},
  {path: 'court-management', component: CourtManagementComponent},
  {path: 'test', component: TestComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
