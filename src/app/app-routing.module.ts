import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsListComponent } from './event/events-list/events-list.component';
import { EventParticipationComponent } from './event/event-participation/event-participation.component';
import { EventPlanComponent } from './event/event-plan/event-plan.component';
import { EventSolicitationListComponent } from './event/event-solicitation-list/event-solicitation-list.component';
import { LoggedGuard } from './auth/services/logged.guard';
import { NoNoNoComponent } from './auth/no-no-no/no-no-no.component';
import { LoginComponent } from './auth/login/login.component';
import { CanAccessEventGuard } from './auth/services/can-access-event.guard';
import { SurveyListComponent } from './survey/survey-list/survey-list.component';
import { SurveyEditComponent } from './survey/survey-edit/survey-edit.component';
import { SurveyAnswerComponent } from './survey/survey-answer/survey-answer.component';
import { SurveyResultsComponent } from './survey/survey-results/survey-results.component';

const routes: Routes = [
  { path: '', redirectTo: 'events-list', pathMatch: 'full' },
  { path: 'events-list', component: EventsListComponent, canActivate: [LoggedGuard]},
  { path: 'event-plan/:eventId', component: EventPlanComponent, canActivate: [CanAccessEventGuard]},
  { path: 'event-participation/:eventId', component: EventParticipationComponent, canActivate: [LoggedGuard]},
  { path: 'event-solicitations/:eventId', component: EventSolicitationListComponent, canActivate: [CanAccessEventGuard]},

  { path: 'survey-list/:eventId', component: SurveyListComponent, canActivate: [CanAccessEventGuard]},
  { path: 'survey-edit/:eventId', component: SurveyEditComponent, canActivate: [CanAccessEventGuard]},
  { path: 'survey-edit/:eventId/:surveyId', component: SurveyEditComponent, canActivate: [CanAccessEventGuard]},
  { path: 'survey-answer/:eventId/:surveyId', component: SurveyAnswerComponent, canActivate: [CanAccessEventGuard]},
  { path: 'survey-results/:eventId/:surveyId', component: SurveyResultsComponent, canActivate: [CanAccessEventGuard]},

  { path: 'no-permission', component: NoNoNoComponent},

  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
