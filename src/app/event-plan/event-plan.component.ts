import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/model/event';
import { DataService } from '../shared/services/data.service';
import { ResourcesGroupedVO, Resource, ResourceGroup } from '../model/resource';
import * as IdUtil from 'src/app/shared/util/id-util';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-plan',
  templateUrl: './event-plan.component.html',
  styleUrls: ['./event-plan.component.css']
})
export class EventPlanComponent implements OnInit {
  IdUtil = IdUtil;
  resourcesGroupedVO: ResourcesGroupedVO[];

  resource: Resource = {
    name: '', meta: undefined, unit: ''
  };

  resourceGroup: ResourceGroup = {
    name: ''
  };

  eventResourceGroup: ResourceGroup;

  event: Event = {name: '', description: ''};

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.dataService.findEvent(params.eventId).subscribe(
        event => this.receiveEvent(event));
    });
  }

  onSubmitEvent() {
    this.dataService.saveEvent(this.event).then(
      event => this.receiveEvent(event));

  }

  onSubmitGroup() {
    this.dataService.saveGroup(this.event.id, this.resourceGroup).then(
      group => this.resourceGroup = group
    );
  }

  onSubmitResource(form: NgForm) {
    this.dataService.saveResource(this.event.id, this.eventResourceGroup.id, this.resource);
    form.resetForm({group: this.resourceGroup});
  }

  private receiveEvent(event: Event) {
    this.event = event;

    this.dataService
      .findResourcesGroupeds(event.id)
      .subscribe(resourcesGroups => {
          this.resourcesGroupedVO = resourcesGroups;
        }
      );
  }

  onGroupDblclick(resourceGroupId) {
    this.dataService.deleteGroup(this.event.id, resourceGroupId);
  }

  onResourceDblclick(resourceGroupId, resource) {
    this.dataService.deleteResource(this.event.id, resourceGroupId, resource.id);
  }
}
