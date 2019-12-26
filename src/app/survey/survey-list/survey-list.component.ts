import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit {

  surveys$: Observable<Survey[]>;
  event: Event;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    this.dataService.findEvent(eventId).subscribe(event => this.event = event);

    this.surveys$ = this.dataService.surveys$(eventId);
  }

}
