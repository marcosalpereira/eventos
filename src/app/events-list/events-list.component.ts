import { Component, OnInit } from '@angular/core';
import { Event } from '../model/event';
import { DataService } from '../shared/services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  events$: Observable<Event[]>;
  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.events$ = this.dataService.events$();
  }

}
