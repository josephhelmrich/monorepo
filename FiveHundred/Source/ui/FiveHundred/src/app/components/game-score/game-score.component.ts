import { EventModel } from './../../models/event.model';
import { CommonService } from './../../shared/common.service';
import { Component, Input, OnInit } from '@angular/core';
import * as models from '../../models/event.model';

@Component({
  selector: 'app-game-score',
  templateUrl: './game-score.component.html',
  styleUrls: ['./game-score.component.scss']
})
export class GameScoreComponent implements OnInit {


  constructor(private common: CommonService) { }

  @Input('event')
  get event(): models.EventModel|null|undefined {
    return this._event;
  }
  set event(value: models.EventModel|null|undefined) {
    this._event = value;

    if (this._event?.currentGame?.teams?.length == 2) {
      var scores = this.common.getTeamsModel(this._event);
      this.teamA = scores[0];
      this.teamB = scores[1];
    }
    else{
      this.teamA = null;
      this.teamB = null;
    }
  }

  private _event:models.EventModel|null|undefined = null;

  teamA: models.ScoringModel|null = null;
  teamB: models.ScoringModel|null = null;


  ngOnInit(): void {
  }

}
