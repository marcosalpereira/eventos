import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin, of, Subscription  } from 'rxjs';
import { Event, Solicitation } from 'src/app/model/event';
import { Resource, ResourceGroup, ParticipationsGrouped, Arrecadation, ResourcesGroupedVO } from 'src/app/model/resource';
import * as IdUtil from 'src/app/shared/util/id-util';
import { Participation } from 'src/app/model/participation';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { mergeMap, map, reduce, take } from 'rxjs/operators';
import { User } from 'src/app/model/user';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private authData = new Subject<User>();
  authData$ = this.authData.asObservable();
  authStateSub: Subscription;

  private resourceGroupedSubject = new Subject<ResourcesGroupedVO[]>();
  private resourceGrouped$ = this.resourceGroupedSubject.asObservable();

  constructor(private fireStore: AngularFirestore, private fireAuth: AngularFireAuth) {
    this.authStateSub = this.fireAuth.authState.subscribe(userData => {
      if (userData) {
        this.getUserData(userData.uid).then(user => {
          this.authData.next(user);
        });
      } else {
        this.authData.next(null);
      }
    });
  }

  googleAuth(): void {
    this.authLogin(new auth.GoogleAuthProvider());
  }

  loggout() {
    this.fireAuth.auth.signOut();
    this.authData.next(null);
  }

  private authLogin(provider: auth.AuthProvider): void {
    this.fireAuth.auth
      .signInWithPopup(provider)
      .then(result => {
        this.authData.next(result.user);
        this.setUserData(result.user);
      })
      .catch(error => {
        window.alert(error);
      });
  }

  private setUserData(fbuser: firebase.User): void {
    const ref: AngularFirestoreDocument<any> = this.fireStore.doc(
      `users/${fbuser.uid}`
    );
    const user: User = {
      uid: fbuser.uid,
      email: fbuser.email,
      displayName: fbuser.displayName,
      photoURL: fbuser.photoURL,
    };
    ref.set(user, {merge: true});
  }


  private async getUserData(uid: string): Promise<User> {
    return this.fireStore.doc(`users/${uid}`)
      .get().pipe(
        map(snapshot => snapshot.data() as User)
      ).toPromise();
  }

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
        if (resourcesArray$.length === 0) { return of([]); }

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

  solicitations$(eventId: string): Observable<Solicitation[]> {
    const path = `events/${eventId}/solicitations`;
    return this.fireStore.collection<Solicitation>(path,
      qfn => qfn.orderBy('_userName', 'asc'))
      .valueChanges();
  }

  resourcesGroups$(eventId: string): Observable<ResourceGroup[]> {
    const path = `events/${eventId}/resources-groups`;
    return this.fireStore.collection<ResourceGroup>(
      path, qfn => qfn.orderBy('name', 'asc'))
    .valueChanges();
  }

  async saveEvent(event: Event): Promise<Event> {
    const id = event.id || IdUtil.id();
    const copy = {...event, id};
    await this.fireStore.collection('events').doc(id)
      .set(copy);
    return Promise.resolve(copy);
  }

  deleteEvent(eventId: string) {
    this.fireStore.collection('events').doc(eventId)
      .delete();
  }

  async saveGroup(eventId: string, resourceGroup: ResourceGroup): Promise<ResourceGroup> {
    const id = resourceGroup.id || IdUtil.id();
    const copy = {...resourceGroup, id};
    await this.fireStore
      .collection('events').doc(eventId)
      .collection('resources-groups').doc(id)
      .set(copy);
    return Promise.resolve(copy);
  }

  deleteGroup(eventId: string, resourceGroupId: string) {
    this.fireStore
      .collection('events').doc(eventId)
      .collection('resources-groups').doc(resourceGroupId)
      .delete().then ( _ => this.emitSelectGroupedResources(eventId));
  }

  async saveResource(eventId: string, resourceGroupId: string, resource: Resource): Promise<Resource> {
    const id = resource.id || IdUtil.id();
    const copy = {...resource, id};
    await this.fireStore
      .collection('events').doc(eventId)
      .collection('resources-groups').doc(resourceGroupId)
      .collection('resources').doc(id)
      .set(copy);
    this.emitSelectGroupedResources(eventId);
    return Promise.resolve(copy);
  }

  async deleteResource(eventId: string, resourceGroupId: string, id: string) {
    await this.fireStore
      .collection('events').doc(eventId)
      .collection('resources-groups').doc(resourceGroupId)
      .collection('resources').doc(id)
      .delete();

    this.emitSelectGroupedResources(eventId);
  }

  deleteParticipation(eventId: string, participationId: string) {
    this.fireStore
      .collection('events').doc(eventId)
      .collection('participations').doc(participationId)
      .delete();
  }

  saveParticipation(eventId: string, participation: Participation) {
    const id = participation.id || IdUtil.id();
    this.fireStore
      .collection('events').doc(eventId)
      .collection('participations').doc(id)
      .set({...participation, id});
  }

  grantSolicitation(eventId: string, solicitation: Solicitation) {
    this.fireStore
      .collection('users').doc(solicitation.personId)
      .collection('events').doc(eventId)
      .set({eventId}, {merge: true})
      .then( () =>
        this.removeSolicitation(eventId, solicitation) );
  }

  removeSolicitation(eventId: string, solicitation: Solicitation) {
    this.solicitation$(eventId, solicitation.id)
      .delete();
  }

  private solicitation$(eventId: string, solicitationId: string): AngularFirestoreDocument<Solicitation> {
    return this.fireStore
      .collection('events').doc(eventId)
      .collection('participations').doc<Solicitation>(solicitationId);
  }
}


