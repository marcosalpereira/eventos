import { Component, OnInit } from '@angular/core';
import { Event } from '../model/event';
import { DataService } from '../shared/services/data.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../model/user';
import { MessageService } from '../shared/util/message.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  events$: Observable<Event[]>;

  constructor(
    private dataService: DataService,
    public authService: AuthService,
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit() {
    this.events$ = this.dataService.events$();
  }

  async onClickParticipation(event: Event) {
    const can = await this.authService.userCanAccessEvent(event.id);
    if (can) {
      this.router.navigate(['/event-participation', event.id]);
    } else {
      this.authService.addEventAccessSolicitation(event.id);
      this.messageService.show('Acesso ao evento solicitado!');
    }
  }

  async onEditSolcitations(event: Event) {
    const can = await this.authService.userCanAccessEvent(event.id);
    if (can) {
      this.router.navigate(['/event-solicitations', event.id]);
    } else {
      this.authService.addEventAccessSolicitation(event.id);
      this.messageService.show('Pedidindo acesso ao evento primeiro!');
    }
  }

  onClickEdit(event: Event) {
    if (this.authService.userCanAccessEvent(event.id)) {
      this.router.navigate(['/event-plan', event.id]);
    } else {
      this.router.navigate(['/event-access-solicitation', event.id]);
    }
  }

  onEventDblclick(event) {
    this.dataService.deleteEvent(event.id);
  }

}
