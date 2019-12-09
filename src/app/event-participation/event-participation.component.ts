import { Participation } from 'src/app/model/participation';
import { Component, OnInit } from '@angular/core';
import { Event } from '../model/event';
import {
  Resource,
  ResourceGroup,
  ResourceGroupVO,
  Arrecadation
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
  resourcesGroups: ResourceGroupVO[];
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
    this.dataService.selectParticipations(id).subscribe(
      participations => this.receiveEventParticipations(participations)
    );
  }

  private receiveEvent(event) {
    this.event = event;
    this.dataService
      .findResourcesGroups(event.id)
      .subscribe(resourcesGroups =>
        this.receiveResourcesGroups(event, resourcesGroups)
      );
  }

  private receiveResourcesGroups(event, resourcesGroups: ResourceGroupVO[]): void {
    this.resourcesGroups = resourcesGroups;
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

  onChangeAmount(group, resource, amount) {

  }

  // onChangeAmount(participation: Participation) {
  //   this.dataService.updateParticipation(participation);
  // }
}
