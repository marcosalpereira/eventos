import { Component, OnInit } from '@angular/core';
import { Evento } from '../model/evento';
import { RecursoParticipante } from '../model/recurso-participante';
import { Recurso } from '../model/recurso';
import { DadosService } from '../shared/services/dados.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-partcipar-evento',
  templateUrl: './partcipar-evento.component.html',
  styleUrls: ['./partcipar-evento.component.css']
})
export class PartciparEventoComponent implements OnInit {

  evento: Evento;
  recursosParticipante: RecursoParticipante[] ;

  constructor(
    private dadosService: DadosService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.dadosService.findEvento(id).subscribe(
      evento => this.evento = evento
    );

    this.recursosParticipante = [];

  }

  onChangeContibuir(recurso: Recurso, e) {
    console.log(e, recurso);
    if (e.checked) {
      this.recursosParticipante.push({recurso});
    }
  }

}
