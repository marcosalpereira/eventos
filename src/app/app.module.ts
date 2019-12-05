import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { EventsListComponent } from './events-list/events-list.component';
import { EventParticipationComponent } from './event-participation/event-participation.component';

@NgModule({
  declarations: [
    AppComponent,
    EventsListComponent,
    EventParticipationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
