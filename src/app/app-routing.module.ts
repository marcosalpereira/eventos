import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarEventosComponent } from './listar-eventos/listar-eventos.component';
import { PartciparEventoComponent } from './participar-evento/participar-evento.component';

const routes: Routes = [
  { path: '', redirectTo: 'eventos', pathMatch: 'full' },
  { path: 'eventos', component: ListarEventosComponent},
  { path: 'participar-evento/:id', component: PartciparEventoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
