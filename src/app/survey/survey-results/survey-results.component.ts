import { Component, OnInit, OnDestroy } from '@angular/core';
import { Survey, Answers } from 'src/app/model/survey';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { take } from 'rxjs/operators';

interface AnswerGrouped {
  question: string;
  votes: number;
}

@Component({
  selector: 'app-survey-results',
  templateUrl: './survey-results.component.html',
  styleUrls: ['./survey-results.component.css']
})
export class SurveyResultsComponent implements OnInit {
  survey: Survey;
  results: AnswerGrouped[];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit() {
    this.route.params.subscribe(params => this.receiveRoute(params));
  }

  private async receiveRoute(params: Params) {
    const eventId = params.eventId;

    this.survey = await this.dataService
      .survey$(eventId, params.surveyId)
      .pipe(take(1)).toPromise();

    const usersAnswers = await this.dataService.surveyAnswers$(eventId, this.survey.id)
      .pipe(take(1)).toPromise();

    this.results = this.survey.questions.split('\n').map((q, i) => {
      return { question: q, votes: 0 };
    });

    usersAnswers.forEach(userAnswer => {
      userAnswer.answers.split(',')
        .forEach(answer => this.results[+answer].votes++);
    });

    this.results.sort((a, b) => b.votes - a.votes);

  }

}
