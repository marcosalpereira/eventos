import { Participation } from 'src/app/model/participation';
import { Component, OnInit } from '@angular/core';
import { Event } from '../model/event';
import {
  Resource,
  ResourceGroup,
  ResourceGroupVO
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
  person: Person;
  resourcesGroups: ResourceGroupVO[];
  participations: Participation[] = [];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.dataService.findEvent(id).subscribe(event => this.receiveEvent(event));
    setTimeout(() => {
      this.participations = [... this.participations, {amount: 1, _resourceName: 'foo', _personName: 'bar', personId: '1', resourceId: '2'}];
    }, 500);
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
    console.log(resourcesGroups)
    this.dataService
      .findParticipations(event.id)
      .subscribe(participations => this.receiveParticipations(participations));
  }

  private receiveParticipations(participations) {
    this.participations = participations;
    this.participarei = this.participations && this.participations.length > 0;
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
