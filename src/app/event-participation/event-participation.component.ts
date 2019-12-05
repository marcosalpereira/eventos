import { Component, OnInit } from '@angular/core';
import { Event } from '../model/event';
import { Resource } from '../model/resource';
import { DataService } from '../shared/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Participation } from '../model/participation';

@Component({
  selector: 'app-event-participation',
  templateUrl: './event-participation.component.html',
  styleUrls: ['./event-participation.component.css']
})
export class EventParticipationComponent implements OnInit {

  event: Event;
  participarei = false;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.dataService.findEvent(id).subscribe(
      event => this.event = event
    );


  }

  onChangeParticipacao() {
    if (this.participarei) {
      this.participation = {
        evento: this.event,
        recursos: []
      }
    } else {
      this.participation = null;
    }
  }

  onChangeContribuir(recurso: Resource, e) {
    console.log(e, recurso);
    if (e.checked) {
      this.participation.recursos.push({recurso});
    }
  }

}
