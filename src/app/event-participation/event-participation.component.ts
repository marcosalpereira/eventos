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
    this.person = {id: '1', name: 'ml'};
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

  private receiveEventParticipations(eventParticipations: Participation[]) {
    this.eventParticipations = eventParticipations;
    this.participations = this.eventParticipations.filter(p => p.personId = this.person.id);
    this.arrecadations = this.groupArrecadations(eventParticipations);
    this.participarei = this.participations && this.participations.length > 0;
  }

  private groupArrecadations(eventParticipations: Participation[]): Arrecadation[] {
    const key = '_resourceName';
    const tmpMap = eventParticipations.reduce( (map, participation) => {
      map[participation[key]] = {
        total: (map[participation[key]] || 0) + participation.amount,
        resourceId: participation.resourceId
      };
      return map;
    }, new Map());

    const ret: Arrecadation[] = [];
    for (const [name, totalAndResource] of Object.entries(tmpMap)) {
      ret.push( {name, total: totalAndResource.total, meta: this.findResourceMeta(totalAndResource.resourceId)} );
    }

    return ret;
  }

  private findResourceMeta(resourceId: string): number {
    const meta = this.participationsGrouped.find(pg => pg.participations.find(pvo => pvo.id === resourceId).meta)

  }

  onClickGravar() {
    this.participationsGrouped.forEach(group => {
      group.participations.forEach(resource => {
        if (resource.participationId && (!this.participarei || resource.amount === 0) ) {
          this.dataService.deleteParticipation(this.event.id, resource.participationId);
        } else {
          if (resource.amount !== 0) {
            const participation = this.toParticipation(resource);
            this.dataService.saveParticipation(this.event.id, participation);
          }
        }
      });
    });
  }

  private toParticipation(resource: ParticipationVO): Participation {
    return {
      id: resource.participationId,
      personId: this.person.id,
      resourceId: resource.id,
      amount: resource.amount,
      _personName: this.person.name,
      _resourceName: resource.name
    };
  }

}
