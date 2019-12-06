import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Event } from 'src/app/model/event';
import { Resource, ResourceGroup, ResourceGroupVO } from 'src/app/model/resource';
import * as IdUtil from 'src/app/shared/util/id-util';
import { Participation } from 'src/app/model/participation';

const CERVEJA: Resource = { id: IdUtil.id(), name: 'Cerveja', meta: 10, unit: '600ml' };
const COCA_COLA: Resource = { id: IdUtil.id(), name: 'Coca-Cola', meta: 4, unit: 'litro' };

const BEBIDAS: Resource[] = [CERVEJA, COCA_COLA];

const ARROZ: Resource = { id: IdUtil.id(), name: 'Arroz', meta: 1, unit: 'Un' };
const BATATA_PALHA: Resource = { id: IdUtil.id(), name: 'Batata palha', meta: 2, unit: 'Kg' };
const COMIDAS: Resource[] = [ARROZ, BATATA_PALHA];

const GRUPO_BEBIDAS: ResourceGroup = { id: IdUtil.id(), name: 'Bebidas' };
const GRUPO_COMIDAS: ResourceGroup = { id: IdUtil.id(), name: 'Comidas' };

const EVENTS: Event[] = [
  {
    id: '1',
    name: 'Natal 2018',
    description: 'Natal 2018'
  },
  {
    id: '2',
    name: 'Natal 2019',
    description: 'Natal 2019'
  }
];

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private participations: Participation[] = [];
  private participationsSubject = new Subject<Participation[]>();
  private participations$ = this.participationsSubject.asObservable();

  constructor() { }

  findEvents(): Observable<Event[]> {
    return of(EVENTS);
  }

  findEvent(id: string): Observable<Event> {
    return of(EVENTS.find(e => e.id === id));
  }

  // shipmentOrders$(shipmentId: string): Observable<ShipmentOrder[]> {
  //   return this.fireStore.collection<User>('users', qfn => qfn.orderBy('displayName', 'asc'))
  //     .valueChanges().pipe(
  //       mergeMap(users => {
  //         const orderObservable = users.map(user => {
  //           return this.fireStore.doc<Order>(`users/${user.uid}/orders/${shipmentId}`).get();
  //         });
  //         return forkJoin<DocumentSnapshot<Order>>(...orderObservable).pipe(
  //           map(ordersDocSnapshot => {
  //             return users.map((user, index) => {
  //               return {
  //                 user, order: ordersDocSnapshot[index].data()
  //               };
  //             });
  //           })
  //         );
  //       })
  //     );
  // }



  findResourcesGroups(eventId: string): Observable<ResourceGroupVO[]> {
    return of([
      {
        ...GRUPO_BEBIDAS,
        participations: BEBIDAS.map( r => ({...r}))
      },
      {
        ...GRUPO_COMIDAS,
        participations: COMIDAS.map( r => ({...r}))
      }
    ]);
  }

  findResources(groupId: string): Observable<Resource[]> {
    if (groupId === GRUPO_BEBIDAS.id) {
      return of(BEBIDAS);
    }
    return of(COMIDAS);
  }

  findParticipations(eventId: string): Observable<Participation[]> {
    setTimeout( () => this.participationsSubject.next(this.participations), 0);
    return this.participations$;
  }

  deleteParticipation(resourceId: string, personId: string) {
    this.participations = this.participations.filter(p => p.resourceId !== resourceId);
    this.participationsSubject.next(this.participations);
  }

  updateParticipation(participation: Participation) {
    const founded = this.participations.find(p => p.resourceId = participation.resourceId);
    founded.amount = participation.amount;
    this.participationsSubject.next(this.participations);
  }

}
