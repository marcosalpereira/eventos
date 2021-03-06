import { Answers, Survey } from './../../model/survey';
import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin, of  } from 'rxjs';
import { Event, Solicitation  } from 'src/app/model/event';
import { Resource, ResourceGroup, ParticipationsGrouped, ResourcesGroupedVO } from 'src/app/model/resource';
import * as IdUtil from 'src/app/shared/util/id-util';
import { Participation } from 'src/app/model/participation';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { mergeMap, map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import * as firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private resourceGroupedSubject = new Subject<ResourcesGroupedVO[]>();
  private resourceGrouped$ = this.resourceGroupedSubject.asObservable();

  constructor(
    private angFireStore: AngularFirestore,
    private authService: AuthService) {
  }

  events$(): Observable<Event[]> {
    return this.angFireStore.collection<Event>('events', qfn => qfn.orderBy('name', 'asc'))
    .valueChanges();
  }

  surveys$(eventId: string): Observable<Survey[]> {
    return this.angFireStore
      .collection('events').doc(eventId)
      .collection<Survey>('surveys')
      .valueChanges().pipe(map(surveys => {
        surveys.forEach(survey => convertSurveyTimestampToDate(survey));
        return surveys;
      }));
  }

  survey$(eventId: string, surveyId: string): Observable<Survey> {
    return this.angFireStore
      .collection('events').doc(eventId)
      .collection('surveys').doc<Survey>(surveyId)
      .valueChanges().pipe(map(survey => convertSurveyTimestampToDate(survey)));
  }

  surveyLoggedUserAnswers$(eventId: string, surveyId: string): Observable<Answers> {
    const uid = this.authService.user.uid;
    return this.angFireStore
      .collection('events').doc(eventId)
      .collection('surveys').doc(surveyId)
      .collection('answers').doc<Answers>(uid)
      .valueChanges();
  }

  surveyAnswers$(eventId: string, surveyId: string): Observable<Answers[]> {
    return this.angFireStore
      .collection('events').doc(eventId)
      .collection('surveys').doc(surveyId)
      .collection<Answers>('answers')
      .valueChanges();
  }

  surveyAnswersSave$(eventId: string, surveyId: string, answers: string): Promise<void> {
    const uid = this.authService.user.uid;
    return this.angFireStore
      .collection('events').doc(eventId)
      .collection('surveys').doc(surveyId)
      .collection('answers').doc<Answers>(uid)
      .set({uid, answers});
  }

  async surveySave(eventId: string, survey: Survey) {
    const id = survey.id || IdUtil.id();
    const copy = {...survey, id};
    copy.expiration = Timestamp.fromDate(survey.expiration as Date);
    return this.angFireStore
      .collection('events').doc(eventId)
      .collection('surveys').doc(id)
      .set(copy);
  }

  deleteSurvey(eventId: string, surveyId: string) {
    this.angFireStore
      .collection('events').doc(eventId)
      .collection('surveys').doc(surveyId)
      .delete();
  }

  findEvent(id: string): Observable<Event> {
    return this.angFireStore.collection('events').doc<Event>(id).valueChanges();
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
    return this.angFireStore.collection<Participation>(
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
    return this.angFireStore.collection<Resource>(path,
      qfn => qfn.orderBy('name', 'asc'))
    .valueChanges();
  }

  solicitations$(eventId: string): Observable<Solicitation[]> {
    const path = `events/${eventId}/solicitations`;
    return this.angFireStore.collection<Solicitation>(path,
      qfn => qfn.orderBy('_userName', 'asc'))
      .valueChanges();
  }

  resourcesGroups$(eventId: string): Observable<ResourceGroup[]> {
    const path = `events/${eventId}/resources-groups`;
    return this.angFireStore.collection<ResourceGroup>(
      path, qfn => qfn.orderBy('name', 'asc'))
    .valueChanges();
  }

  async saveEvent(event: Event): Promise<Event> {
    const id = event.id || IdUtil.id();
    const copy = {...event, id};
    await this.angFireStore.collection('events').doc(id)
      .set(copy);
    if (!event.id) {
      this.authService.grantEventAccess(id, this.authService.user.uid);
    }
    return Promise.resolve(copy);
  }

  deleteEvent(eventId: string) {
    this.angFireStore.collection('events').doc(eventId)
      .delete();
  }

  async saveGroup(eventId: string, resourceGroup: ResourceGroup): Promise<ResourceGroup> {
    const id = resourceGroup.id || IdUtil.id();
    const copy = {...resourceGroup, id};
    await this.angFireStore
      .collection('events').doc(eventId)
      .collection('resources-groups').doc(id)
      .set(copy);
    return Promise.resolve(copy);
  }

  deleteGroup(eventId: string, resourceGroupId: string) {
    this.angFireStore
      .collection('events').doc(eventId)
      .collection('resources-groups').doc(resourceGroupId)
      .delete().then ( _ => this.emitSelectGroupedResources(eventId));
  }

  async saveResource(eventId: string, resourceGroupId: string, resource: Resource): Promise<Resource> {
    const id = resource.id || IdUtil.id();
    const copy = {...resource, id};
    await this.angFireStore
      .collection('events').doc(eventId)
      .collection('resources-groups').doc(resourceGroupId)
      .collection('resources').doc(id)
      .set(copy);
    this.emitSelectGroupedResources(eventId);
    return Promise.resolve(copy);
  }

  async deleteResource(eventId: string, resourceGroupId: string, id: string) {
    await this.angFireStore
      .collection('events').doc(eventId)
      .collection('resources-groups').doc(resourceGroupId)
      .collection('resources').doc(id)
      .delete();

    this.emitSelectGroupedResources(eventId);
  }

  deleteParticipation(eventId: string, participationId: string) {
    this.angFireStore
      .collection('events').doc(eventId)
      .collection('participations').doc(participationId)
      .delete();
  }

  saveParticipation(eventId: string, participation: Participation) {
    const id = participation.id || IdUtil.id();
    this.angFireStore
      .collection('events').doc(eventId)
      .collection('participations').doc(id)
      .set({...participation, id});
  }

}

function convertSurveyTimestampToDate(survey: Survey): Survey {
  survey.expiration = (survey.expiration as Timestamp).toDate();
  return survey;
}

