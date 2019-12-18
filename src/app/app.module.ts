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
import { EventAccessSolicitationsComponent } from './auth/event-access-solicitations/event-access-solicitations.component';
import { NoNoNoComponent } from './auth/no-no-no/no-no-no.component';

@NgModule({
  declarations: [
    AppComponent,
    EventsListComponent,
    EventParticipationComponent,
    EventPlanComponent,
    EventSolicitationListComponent,
    LoginComponent,
    EventAccessSolicitationsComponent,
    NoNoNoComponent
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
