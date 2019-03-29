import { Component, OnInit } from '@angular/core';
import { Evento } from '../model/evento';

@Component({
  selector: 'app-listar-eventos',
  templateUrl: './listar-eventos.component.html',
  styleUrls: ['./listar-eventos.component.css']
})
export class ListarEventosComponent implements OnInit {
  eventos: Evento[];

  constructor() { }

  ngOnInit() {
    this.eventos = [
      { id: 1, nome: 'Evento 1', descricao: 'Evento para bla bla bla' },
      { id: 2, nome: 'Evento 2', descricao: 'Evento para bla bla bla' },
      { id: 3, nome: 'Evento 3', descricao: 'Evento para bla bla bla' }
    ]
  }

}
