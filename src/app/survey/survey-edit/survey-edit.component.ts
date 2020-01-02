import { Component, OnInit, OnDestroy } from '@angular/core';
import { Survey } from 'src/app/model/survey';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-survey-edit',
  templateUrl: './survey-edit.component.html',
  styleUrls: ['./survey-edit.component.css']
})
export class SurveyEditComponent implements OnInit, OnDestroy {
  survey: Survey;
  eventId: string;
  surveySub: Subscription;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit() {
    this.route.params.subscribe(params => this.receiveRoute(params));
  }

  ngOnDestroy() {
    this.surveySubUnsub();
  }

  private surveySubUnsub() {
    if (this.surveySub) {
      this.surveySub.unsubscribe();
    }
  }

  private async receiveRoute(params: Params) {
    this.eventId = params.eventId;
    if (params.surveyId) {
      this.surveySubUnsub();
      this.surveySub = this.dataService
        .survey$(this.eventId, params.surveyId)
        .subscribe(survey => this.survey = survey);
    } else {
      this.survey = {
        id: undefined,
        name: '',
        questions: '',
        maxAnswers: 1,
      };
    }
  }

  onSubmit() {
    this.dataService.surveySave(this.eventId, this.survey);
  }



}
