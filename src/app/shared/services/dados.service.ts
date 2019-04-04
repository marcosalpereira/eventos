import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Evento } from 'src/app/model/evento';
import { Recurso } from 'src/app/model/recurso';

const LEITE: Recurso = { nome: 'Leite', quantidade: 10, unidade: 'litro' };
const OVO: Recurso = { nome: 'Ovo', quantidade: 100, unidade: 'Un' };
const ACUCAR: Recurso = { nome: 'Açucar', quantidade: 10, unidade: 'Kg' };
const SAL: Recurso = { nome: 'Sal', quantidade: 2, unidade: 'Kg' };
const PICANHA: Recurso = { nome: 'Picanha', quantidade: 10, unidade: 'Pc' };
const MANTEIGA: Recurso = { nome: 'Manteiga', quantidade: 5, unidade: 'Kg' };
const MOLHO_TOMATE: Recurso = { nome: 'Molho de Tomate', quantidade: 5, unidade: 'Kg' };

const EVENTOS: Evento[] = [
  {
    id: 1,
    nome: 'Sabores da Itália',
    descricao: 'Realizar jantar tema da itália',
    recursos: [
      LEITE, MOLHO_TOMATE, OVO, ACUCAR, SAL, PICANHA
    ]
  },
  {
    id: 1,
    nome: 'Sabores da França',
    descricao: 'Realizar jantar tema da França' ,
    recursos: [
      LEITE, MANTEIGA, OVO
    ]

  }
]

@Injectable({
  providedIn: 'root'
})
export class DadosService {

  constructor() { }

  findEventosAtivos(): Observable<Evento[]> {
    return of(EVENTOS);
  }

  findEvento(id: number): Observable<Evento> {
    return of(EVENTOS.find(e => e.id === id));
  }

}
