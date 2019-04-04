import { Component, OnInit } from '@angular/core';
import { Evento } from '../model/evento';
import { DadosService } from '../shared/services/dados.service';

@Component({
  selector: 'app-listar-eventos',
  templateUrl: './listar-eventos.component.html',
  styleUrls: ['./listar-eventos.component.css']
})
export class ListarEventosComponent implements OnInit {
  eventos: Evento[];

  constructor(private dadosService: DadosService) { }

  ngOnInit() {
    this.dadosService.findEventosAtivos().subscribe(
      eventos => this.eventos = eventos
    );
  }

}
