import { Component, OnInit } from '@angular/core';
import { Evento } from '../model/evento';
import { RecursoParticipacao } from '../model/recurso-participacao';
import { Recurso } from '../model/recurso';
import { DadosService } from '../shared/services/dados.service';
import { ActivatedRoute } from '@angular/router';
import { Participacao } from '../model/participacao';

@Component({
  selector: 'app-participar-evento',
  templateUrl: './participar-evento.component.html',
  styleUrls: ['./participar-evento.component.css']
})
export class PartciparEventoComponent implements OnInit {

  evento: Evento;
  participarei = false;
  participacao: Participacao;

  constructor(
    private dadosService: DadosService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.dadosService.findEvento(id).subscribe(
      evento => this.evento = evento
    );


  }

  onChangeParticipacao() {
    if (this.participarei) {
      this.participacao = {
        evento: this.evento,
        recursos: []
      }
    } else {
      this.participacao = null;
    }
  }

  onChangeContribuir(recurso: Recurso, e) {
    console.log(e, recurso);
    if (e.checked) {
      this.participacao.recursos.push({recurso});
    }
  }

}
