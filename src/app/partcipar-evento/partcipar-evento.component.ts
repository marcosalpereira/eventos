import { Component, OnInit } from '@angular/core';
import { Evento } from '../model/evento';
import { RecursoParticipante } from '../model/recurso-participante';
import { Recurso } from '../model/recurso';

@Component({
  selector: 'app-partcipar-evento',
  templateUrl: './partcipar-evento.component.html',
  styleUrls: ['./partcipar-evento.component.css']
})
export class PartciparEventoComponent implements OnInit {

  evento: Evento;
  recursosParticipante: RecursoParticipante[];

  constructor() { }

  ngOnInit() {
    const leite: Recurso = { nome: 'Leite', quantidade: 10, unidade: 'litro' };
    this.evento = {
      id: 1,
      nome: 'Evento 1',
      descricao: 'Evento para bla bla bla',
      recurso: [
        leite,
        {nome: 'Água',  quantidade: 20, unidade: 'litro'},
      ]
     };

    this.recursosParticipante = [
      { recurso: leite }
    ];
  }

}
