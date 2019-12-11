import { Participation } from 'src/app/model/participation';
import { Component, OnInit } from '@angular/core';
import { Event } from '../model/event';
import {
  ParticipationsGrouped,
  Arrecadation,
  ResourcesGroupedVO,
  Resource,
  ParticipationVO
} from '../model/resource';
import { DataService } from '../shared/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Person } from '../model/person';

@Component({
  selector: 'app-event-participation',
  templateUrl: './event-participation.component.html',
  styleUrls: ['./event-participation.component.css']
})
export class EventParticipationComponent implements OnInit {
  event: Event;
  participarei = false;
  person: Partial<Person>;
  participationsGrouped: ParticipationsGrouped[];
  eventParticipations: Participation[] = [];
  participations: Participation[] = [];
  arrecadations: Arrecadation[] = [];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.person = {id: '1'};
    const id = this.route.snapshot.paramMap.get('id');

    this.dataService.findEvent(id).subscribe(event => this.receiveEvent(event));

    this.dataService.participations$(id).subscribe(
      participations => this.receiveEventParticipations(participations)
    );
  }

  private receiveEvent(event) {
    this.event = event;
    this.dataService
      .findResourcesGroupeds(event.id)
      .subscribe(resourcesGroups =>
        this.mergeResourcesAndParticipations(resourcesGroups)
      );
  }

  private mergeResourcesAndParticipations(resourcesGroups: ResourcesGroupedVO[]) {
      this.participationsGrouped = resourcesGroups.map( rg => {
        const pg = {
          id: rg.id,
          name: rg.name,
          participations: this.toParticipationsVO(rg.resources, this.participations)
        };
        return pg;
      });
  }

  private toParticipationsVO(resources: Resource[], participations: Participation[]): ParticipationVO[] {
    return resources.map( resource => {
      const participation = participations.find(p => p.resourceId === resource.id);
      const participationVO: ParticipationVO = {...resource, amount: 0};
      if (participation) {
        participationVO.participationId = participation.id;
        participationVO.amount =  participation.amount;
      }
      return participationVO;
    });
  }

  private findParticipation(r: Resource, participations: Participation[]): number {
    const participation = participations.find(p => p.resourceId === r.id);
    return participation ? participation.amount : 0;
  }


  private receiveEventParticipations(eventParticipations: Participation[]) {
    this.eventParticipations = eventParticipations;
    this.participations = this.eventParticipations.filter(p => p.personId = this.person.id);
    this.arrecadations = this.groupArrecadations(eventParticipations);
    this.participarei = this.participations && this.participations.length > 0;
  }

  private groupArrecadations(eventParticipations: Participation[]): Arrecadation[] {
    const key = '_resourceName';
    const tmpMap = eventParticipations.reduce( (map, participation) => {
      map[participation[key]] = (map[participation[key]] || 0) + participation.amount;
      return map;
    }, new Map());

    const ret: Arrecadation[] = [];
    for (const [name, total] of Object.entries(tmpMap)) {
      ret.push( {name, total} );
    }

    return ret;
  }

  // onChangeContribuir(resource: Resource, ev) {
  //   if (ev.checked) {
  //     this.participations.push({
  //       resourceId: resource.id,
  //       personId: this.person.id,
  //       amount: 0,
  //       _resourceName: resource.name
  //     });
  //   } else {
  //     this.dataService.deleteParticipation(resource.id, this.person.id);
  //   }
  // }

  onChangeAmount() {

  }

  // onChangeAmount(participation: Participation) {
  //   this.dataService.updateParticipation(participation);
  // }
}
