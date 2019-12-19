import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsListComponent } from './events-list/events-list.component';
import { EventParticipationComponent } from './event-participation/event-participation.component';
import { EventPlanComponent } from './event-plan/event-plan.component';
import { EventSolicitationListComponent } from './event-solicitation-list/event-solicitation-list.component';
import { EventAccessSolicitationsComponent } from './auth/event-access-solicitations/event-access-solicitations.component';
import { AdminGuard } from './auth/services/admin.guard';
import { LoggedGuard } from './auth/services/logged.guard';
import { NoNoNoComponent } from './auth/no-no-no/no-no-no.component';
import { LoginComponent } from './auth/login/login.component';
import { CanAccessEventGuard } from './auth/services/can-access-event.guard';

const routes: Routes = [
  { path: '', redirectTo: 'events-list', pathMatch: 'full' },
  { path: 'events-list', component: EventsListComponent, canActivate: [LoggedGuard]},
  { path: 'event-plan/:id', component: EventPlanComponent, canActivate: [CanAccessEventGuard]},
  { path: 'event-participation/:id', component: EventParticipationComponent, canActivate: [LoggedGuard]},
  { path: 'event-solicitations/:id', component: EventSolicitationListComponent, canActivate: [CanAccessEventGuard]},
  { path: 'event-access-solicitation/:id', component: EventAccessSolicitationsComponent, canActivate: [AdminGuard]},
  { path: 'no-permission', component: NoNoNoComponent},
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
