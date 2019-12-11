import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin, of  } from 'rxjs';
import { Event } from 'src/app/model/event';
import { Resource, ResourceGroup, ParticipationsGrouped, Arrecadation, ResourcesGroupedVO } from 'src/app/model/resource';
import * as IdUtil from 'src/app/shared/util/id-util';
import { Participation } from 'src/app/model/participation';
import { AngularFirestore } from '@angular/fire/firestore';
import { mergeMap, map, reduce, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private resourceGroupedSubject = new Subject<ResourcesGroupedVO[]>();
  private resourceGrouped$ = this.resourceGroupedSubject.asObservable();

  constructor(private fireStore: AngularFirestore) { }

  events$(): Observable<Event[]> {
    return this.fireStore.collection<Event>('events', qfn => qfn.orderBy('name', 'asc'))
    .valueChanges();
  }

  findEvent(id: string): Observable<Event> {
    return this.fireStore.collection('events').doc<Event>(id).valueChanges();
  }

  findParticipationsGroups(eventId: string): Observable<ParticipationsGrouped[]> {
    return this.participations$(eventId).pipe(
          map<Participation[], ParticipationsGrouped[]>( participations => {
            return this.groupParticipations(participations);
          })
      );
  }

  private groupParticipations(participations: Participation[]): ParticipationsGrouped[] {
    const key = '_resourceName';
    const tmpMap = participations.reduce((acc, participation) => {
      acc[participation[key]] = (acc[participation[key]] || []).push(participation);
      return acc;
    }, new Map());
    const ret: ParticipationsGrouped[] = [];
    for (const [groupName, list] of Object.entries(tmpMap)) {
      ret.push({ id: list[0].id, name: groupName, participations: list });
    }
    return ret;
  }

  participations$(eventId: string): Observable<Participation[]> {
    return this.fireStore.collection<Participation>(
      `events/${eventId}/participations`, qfn => qfn.orderBy('_resourceName', 'asc')
    ).valueChanges();
  }

  findResourcesGroupeds(eventId: string): Observable<ResourcesGroupedVO[]> {
    setTimeout( () => this.emitSelectGroupedResources(eventId), 0);
    return this.resourceGrouped$;
  }

  private emitSelectGroupedResources(eventId: string): void {
    this.selectGroupedResources$(eventId).subscribe(
      gr => this.resourceGroupedSubject.next(gr)
    );
  }

  private selectGroupedResources$(eventId: string): Observable<ResourcesGroupedVO[]> {
    return this.resourcesGroups$(eventId).pipe(
      mergeMap(resourcesGroups => {
        const resourcesArray$ = resourcesGroups.map(resourceGroup => {
          return this.resources$(eventId, resourceGroup.id).pipe(take(1));
        });
        return forkJoin(resourcesArray$).pipe(
          map(resourcesArrray => {
            return resourcesGroups.map( (resourceGroup, index) => {
              return {
                id: resourceGroup.id,
                name: resourceGroup.name,
                resources: resourcesArrray[index]
              };
            });
          })
        );
      })
    );
  }

  private resources$(eventId: string, resourceGroupId: string): Observable<Resource[]> {
    const path = `events/${eventId}/resources-groups/${resourceGroupId}/resources`;
    return this.fireStore.collection<Resource>(path,
      qfn => qfn.orderBy('name', 'asc'))
    .valueChanges();
  }

  resourcesGroups$(eventId: string): Observable<ResourceGroup[]> {
    const path = `events/${eventId}/resources-groups`;
    return this.fireStore.collection<ResourceGroup>(
      path, qfn => qfn.orderBy('name', 'asc'))
    .valueChanges();
  }

  deleteParticipation(participationId: string) {
    this.fireStore.collection('participations').doc(participationId).delete();
  }

  updateParticipation(participation: Participation) {
    this.fireStore.collection('participations').doc(participation.id).set(
      participation, {merge: true}
    );
  }

  async addEvent(event: Event): Promise<Event> {
    const id = IdUtil.id();
    const copy = {...event, id};
    await this.fireStore.collection('events').doc(id)
      .set(copy);
    return Promise.resolve(copy);
  }

  async addGroup(eventId: string, resourceGroup: ResourceGroup): Promise<ResourceGroup> {
    const id = IdUtil.id();
    const copy = {...resourceGroup, id};
    await this.fireStore
      .collection('events').doc(eventId)
      .collection('resources-groups').doc(id)
      .set(copy);
    return Promise.resolve(copy);
  }

  async addResource(eventId: string, resourceGroupId: string, resource: Resource): Promise<Resource> {
    const id = IdUtil.id();
    const copy = {...resource, id};
    await this.fireStore
      .collection('events').doc(eventId)
      .collection('resources-groups').doc(resourceGroupId)
      .collection('resources').doc(id)
      .set(copy);
    this.emitSelectGroupedResources(eventId);
    return Promise.resolve(copy);
  }

}


