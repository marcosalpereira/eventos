import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Event, Solicitation } from '../model/event';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-event-solicitation-list',
  templateUrl: './event-solicitation-list.component.html',
  styleUrls: ['./event-solicitation-list.component.css']
})
export class EventSolicitationListComponent implements OnInit {
  solicitations$: Observable<Solicitation[]>;
  event: Event;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    this.dataService.findEvent(eventId).subscribe(event => this.event = event);
    this.solicitations$ = this.dataService.solicitations$(eventId);
  }

  conceder(solicitation) {
    this.authService.grantSolicitation(this.event.id, solicitation);
  }

  apagar(solicitation) {
    this.authService.removeSolicitation(this.event.id, solicitation);
  }

}
