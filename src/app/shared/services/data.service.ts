import { Injectable } from '@angular/core';
import { Observable, of, Subject, forkJoin } from 'rxjs';
import { Event } from 'src/app/model/event';
import { Resource, ResourceGroup, ParticipationsGrouped, Arrecadation, ResourcesGroupedVO } from 'src/app/model/resource';
import * as IdUtil from 'src/app/shared/util/id-util';
import { Participation } from 'src/app/model/participation';
import { AngularFirestore } from '@angular/fire/firestore';
import { mergeMap, map } from 'rxjs/operators';

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

  private tmpParticipations: Participation[] = [];
  private eventParticipationsSubject = new Subject<Participation[]>();
  private eventParticipations$ = this.eventParticipationsSubject.asObservable();

  constructor(private fireStore: AngularFirestore) { }

  events$(): Observable<Event[]> {
    return this.fireStore.collection<Event>('events', qfn => qfn.orderBy('name', 'asc'))
    .valueChanges();
  }

  findEvent(id: string): Observable<Event> {
    return this.fireStore.collection('events').doc<Event>(id).valueChanges();
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

  //
  findParticipationsGroups(eventId: string): Observable<ParticipationsGrouped[]> {
    return this.fireStore.collection<ResourceGroup>(`events/${eventId}/resources-groups`)
      .valueChanges().pipe(
      mergeMap(grps => {
        const participationsObservableArray = grps.map(grp => {
          return this.fireStore.collection<Participation>(`events/${eventId}/resources-groups/${grp.id}/participations`).valueChanges();
        });
        return forkJoin([...participationsObservableArray]).pipe(
          map(participations => {
            return grps.map((grp, index) => {
              const part: ParticipationsGrouped = {
                id: grp.id,
                name: grp.name,
                participations: participations[index].map(v => {
                  return {
                    id:
                  }
                })
              };
              return part;
            });
          })
        );
      })
    );
    return o;
  }
  findResourcesGroupeds(eventId: string): Observable<ResourcesGroupedVO[]> {
    return of([
      {
        ...GRUPO_BEBIDAS,
        resources: BEBIDAS
      },
      {
        ...GRUPO_COMIDAS,
        resources: COMIDAS
      }
    ]);
  }


  findResources(groupId: string): Observable<Resource[]> {
    if (groupId === GRUPO_BEBIDAS.id) {
      return of(BEBIDAS);
    }
    return of(COMIDAS);
  }

  deleteParticipation(resourceId: string, personId: string) {
    this.tmpParticipations = this.tmpParticipations.filter(p =>
      ! (p.resourceId === resourceId && p.personId === personId) );
    this.eventParticipationsSubject.next(this.tmpParticipations);
  }

  updateParticipation(participation: Participation) {
    const founded = this.tmpParticipations.find(p =>
      (p.resourceId === participation.resourceId && p.personId === participation.personId));
    founded.amount = participation.amount;
    this.eventParticipationsSubject.next(this.tmpParticipations);
  }

  selectParticipations(eventId: string): Observable<Participation[]> {
    setInterval(() => {
      const r = shuffle([...BEBIDAS, ...COMIDAS])[0];
      this.tmpParticipations = [... this.tmpParticipations,
        {amount: getRandom(1, 3), _resourceName: r.name, _personName: 'Fulano', personId: '1', resourceId: r.id}];
      this.eventParticipationsSubject.next(this.tmpParticipations);
    }, 2000);
    return this.eventParticipations$;
  }

  addEvent(event: Event): Observable<Event> {
    event.id = IdUtil.id();
    EVENTS.push(event);
    return of(event);
  }

  addGroup(resourceGroup: ResourceGroup) {

  }

  addResource(resourceGroup: ResourceGroup, resource: Resource) {

  }


}




function getRandom(min, max) {
  return Math.trunc(Math.random() * (max - min) + min);
}

function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue: number;
  let randomIndex: number;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
