import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { EventsListComponent } from './events-list/events-list.component';
import { EventParticipationComponent } from './event-participation/event-participation.component';
import { EventPlanComponent } from './event-plan/event-plan.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { EventSolicitationListComponent } from './event-solicitation-list/event-solicitation-list.component';
import { LoginComponent } from './auth/login/login.component';
import { NoNoNoComponent } from './auth/no-no-no/no-no-no.component';
import { SurveyListComponent } from './survey/survey-list/survey-list.component';
import { SurveyEditComponent } from './survey/survey-edit/survey-edit.component';
import { SurveyAnswerComponent } from './survey/survey-answer/survey-answer.component';
import { SecretFriendSortComponent } from './secret-friend/secret-friend-sort/secret-friend-sort.component';

@NgModule({
  declarations: [
    AppComponent,
    EventsListComponent,
    EventParticipationComponent,
    EventPlanComponent,
    EventSolicitationListComponent,
    LoginComponent,
    NoNoNoComponent,
    SurveyListComponent,
    SurveyEditComponent,
    SurveyAnswerComponent,
    SecretFriendSortComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
