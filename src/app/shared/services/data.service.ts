import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from 'src/app/model/event';
import { Resource, ResourceGroup } from 'src/app/model/resource';
import * as IdUtil from 'src/app/shared/util/id-util';

const CERVEJA: Resource = {id: IdUtil.id(), name: 'Cerveja', amount: 10, unit: '600ml' };
const COCA_COLA: Resource = {id: IdUtil.id(), name: 'Coca-Cola', amount: 4, unit: 'litro' };

const BEBIDAS: Resource[] = [CERVEJA, COCA_COLA];

const ARROZ: Resource = {id: IdUtil.id(), name: 'Arroz', amount: 1, unit: 'Un' };
const BATATA_PALHA: Resource = {id: IdUtil.id(), name: 'Batata palha', amount: 2, unit: 'Kg' };
const COMIDAS: Resource[] = [ARROZ, BATATA_PALHA];

const GRUPO_BEBIDAS: ResourceGroup = {id: IdUtil.id(), name: 'Bebidas'};
const GRUPO_COMIDAS: ResourceGroup = {id: IdUtil.id(), name: 'Comidas'};

const EVENTS: Event[] = [
  {
    id: IdUtil.id(),
    name: 'Natal 2018',
    description: 'Natal 2018'
  },
  {
    id: IdUtil.id(),
    name: 'Natal 2019',
    description: 'Natal 2019'
  }
];

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  findEvents(): Observable<Event[]> {
    return of(EVENTS);
  }

  findEvent(id: string): Observable<Event> {
    return of(EVENTS.find(e => e.id === id));
  }

  findResourcesGroups(eventId: string): Observable<ResourceGroup[]> {
    return of([GRUPO_COMIDAS, GRUPO_BEBIDAS]);
  }

  findResources(groupId: string): Observable<Resource[]> {
    if (groupId === GRUPO_BEBIDAS.id) {
      return of(BEBIDAS);
    }
    return of(COMIDAS);
  }

}
