import { Component, OnInit, OnDestroy } from '@angular/core';
import { Survey } from 'src/app/model/survey';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as DateUtil from 'src/app/shared/util/date-util';

@Component({
  selector: 'app-survey-edit',
  templateUrl: './survey-edit.component.html',
  styleUrls: ['./survey-edit.component.css']
})
export class SurveyEditComponent implements OnInit, OnDestroy {
  survey: Survey;
  eventId: string;
  surveySub: Subscription;
  expirationDate: Date;
  expirationTime: string;
  minExpirationDate = new Date();

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
        .subscribe(survey => this.receiveSurvey(survey));
    } else {
      this.survey = {
        id: undefined,
        name: '',
        questions: '',
        maxAnswers: 1,
        expiration: new Date()
      };
    }
  }

  private receiveSurvey(survey: Survey) {
    this.survey = survey;
    this.expirationDate = this.survey.expiration as Date;
    this.expirationTime = DateUtil.formatHHMM(this.expirationDate);
  }

  onSubmit() {
    this.survey.expiration = this.expirationDate;
    const expTime = DateUtil.toDate(this.expirationTime);
    this.survey.expiration.setHours(expTime.getHours());
    this.survey.expiration.setMinutes(expTime.getMinutes());
    this.dataService.surveySave(this.eventId, this.survey);
  }



}
