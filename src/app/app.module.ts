import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { PlanejarEventoComponent } from './planejar-evento/planejar-evento.component';
import { ListarEventosComponent } from './listar-eventos/listar-eventos.component';
import { PartciparEventoComponent } from './partcipar-evento/partcipar-evento.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PlanejarEventoComponent,
    ListarEventosComponent,
    PartciparEventoComponent,
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
