import { Component, OnInit, OnDestroy } from '@angular/core';
import { Survey } from 'src/app/model/survey';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { take } from 'rxjs/operators';

interface QuestionAnswer {
  number: number;
  question: string;
  value: boolean;
}

@Component({
  selector: 'app-survey-answer',
  templateUrl: './survey-answer.component.html',
  styleUrls: ['./survey-answer.component.css']
})
export class SurveyAnswerComponent implements OnInit, OnDestroy {
  survey: Survey;
  eventId: string;
  surveySub: Subscription;
  formInvalid = true;
  answers: QuestionAnswer[];
  surveyId: any;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
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

    this.survey = await this.dataService
        .survey$(this.eventId, params.surveyId)
        .pipe(take(1)).toPromise();

    const answerDb = await this.dataService.surveyLoggedUserAnswers$(this.eventId, this.survey.id)
      .pipe(take(1)).toPromise();

    this.answers = this.survey.questions.split('\n').map( (q, i) => {
            return { number: i, question: q, value: false };
          });

    if (answerDb) {
      answerDb.answers.split(',').forEach( position => {
        this.answers[+position].value = true;
      });
      this.checkAnswers();
    }

  }

  checkAnswers() {
    this.formInvalid = this.answers.filter(a => a.value).length !== this.survey.maxAnswers;
  }

  onSubmit() {
    const respostas = this.answers.filter(a => a.value).map(a => a.number).join();
    this.dataService.surveyAnswersSave$(this.eventId, this.survey.id, respostas);
  }

}
