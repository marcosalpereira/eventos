import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Survey } from 'src/app/model/survey';
import { Observable } from 'rxjs';
import { Event } from 'src/app/model/event';

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
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.receiveRoute(params));
  }

  private receiveRoute(params: Params): void {
    this.surveys$ = this.dataService.surveys$(params.eventId);

    this.dataService.findEvent(params.eventId).subscribe(
        event => this.event = event
    );
  }

  onClickAnswer(survey: Survey) {
    this.router.navigate(['/survey-answer', this.event.id, survey.id]);
  }

  onClickEdit(survey: Survey) {
    this.router.navigate(['/survey-edit', this.event.id, survey.id]);
  }

  onSurveyDblclick(survey: Survey) {
    this.dataService.deleteSurvey(this.event.id, survey.id);
  }
}
