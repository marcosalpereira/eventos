import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/model/event';
import { DataService } from '../shared/services/data.service';
import { ResourcesGroupedVO, Resource, ResourceGroup } from '../model/resource';
import * as IdUtil from 'src/app/shared/util/id-util';

@Component({
  selector: 'app-event-plan',
  templateUrl: './event-plan.component.html',
  styleUrls: ['./event-plan.component.css']
})
export class EventPlanComponent implements OnInit {
  IdUtil = IdUtil;
  resourcesGroups: ResourceGroup[] = [];
  resourcesGroupedVO: ResourcesGroupedVO[];
  resource: Resource = {
    name: '', meta: undefined, unit: ''
  };

  resourceGroup: ResourceGroup = {
    name: ''
  };

  event: Event = {name: '', description: ''};
  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  onSubmitEvent() {
    this.dataService.addEvent(this.event).then(
      event => this.receiveEvent(event));

  }

  onSubmitGroup() {
    this.dataService.addGroup(this.event.id, this.resourceGroup).then(
      group => this.resourceGroup = group
    );
  }

  onSubmitResource() {
    this.dataService.addResource(this.event.id, this.resourceGroup.id, this.resource);
  }

  private receiveEvent(event: Event) {
    this.event = event;
    this.dataService.resourcesGroups$(event.id).subscribe(
      grps => this.resourcesGroups = grps
    );

    this.dataService
      .findResourcesGroupeds(event.id)
      .subscribe(resourcesGroups => {
          this.resourcesGroupedVO = resourcesGroups;
        }
      );
  }
}
