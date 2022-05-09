import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourtComponent } from './components/court/court.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  {path: '', redirectTo:'home', pathMatch: 'full' },
  {path: 'tennis-scheduler', component: HomeComponent},
  {path: 'tennis-scheduler/overview', component: CourtComponent},
  {path: 'profile/:userIdPlaceholder', component: UserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
