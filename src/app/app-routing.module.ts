import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsListComponent } from './events-list/events-list.component';
import { EventParticipationComponent } from './event-participation/event-participation.component';
import { EventPlanComponent } from './event-plan/event-plan.component';
import { EventSolicitationComponent } from './event-solicitation/event-solicitation.component';

const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'event-plan', component: EventPlanComponent},
  { path: 'event-plan/:id', component: EventPlanComponent},
  { path: 'events', component: EventsListComponent},
  { path: 'event-participation/:id', component: EventParticipationComponent},
  { path: 'event-solicitation/:id', component: EventSolicitationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
