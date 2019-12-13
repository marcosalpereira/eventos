import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Event, Solicitation } from '../model/event';

@Component({
  selector: 'app-event-solicitation',
  templateUrl: './event-solicitation.component.html',
  styleUrls: ['./event-solicitation.component.css']
})
export class EventSolicitationComponent implements OnInit {
  solicitations$: Observable<Solicitation[]>;
  event: Event;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    this.dataService.findEvent(eventId).subscribe(event => this.event = event);
    this.solicitations$ = this.dataService.solicitations$(eventId);
  }

  conceder(solicitation) {
    this.dataService.grantSolicitation(this.event.id, solicitation);
  }

  apagar(solicitation) {
    this.dataService.removeSolicitation(this.event.id, solicitation);
  }

}
