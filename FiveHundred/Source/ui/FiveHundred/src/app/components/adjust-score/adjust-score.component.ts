import { CommonService } from './../../shared/common.service';
import { eventRefreshedAction } from './../../store/five-hundred.actions';
import { EventModel } from './../../models/event.model';
import { EventBaseComponent } from './../event-base/event-base.component';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as models from "../../models/event.model";
import { UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-adjust-score',
  templateUrl: './adjust-score.component.html',
  styleUrls: ['./adjust-score.component.scss']
})
export class AdjustScoreComponent implements OnInit {

  teamA: models.ScoringModel|null = null;
  teamB: models.ScoringModel|null = null;
  hand: models.HandModel|null;
  event: models.EventModel|null;
  invalid: boolean = true;
  result: models.AdjustScoreRequest;

  teamAFormControl = new UntypedFormControl('', [Validators.required]);
  teamBFormControl = new UntypedFormControl('', [Validators.required]);


  constructor(@Inject(MAT_DIALOG_DATA) data: any, common: CommonService) {
    this.hand = data.hand;
    this.event = data.event;

    var teams = common.getTeamsModel(this.event);
    if (teams && teams.length == 2){
      this.teamA = teams[0];
      this.teamB = teams[1];
    }

    this.result = {
      eventId: this.event?.id ?? "",
      handId: this.hand?.id ?? "",
      teamAScore: this.hand?.teamAScore?.handScore ?? 0,
      teamBScore: this.hand?.teamBScore?.handScore ?? 0
    }
  }

  ngOnInit(): void {
    this.teamAFormControl.setValue(this.hand?.teamAScore?.handScore);
    this.teamBFormControl.setValue(this.hand?.teamBScore?.handScore);
    this.validate();
  }

  validate(): void {
    var a = Number(this.teamAFormControl.value ?? 0);
    var b = Number(this.teamBFormControl.value ?? 0);

    this.invalid = a < -800 || a > 800 || b < -800 || b > 800;

    if (this.invalid === false){
      this.result.teamAScore = a;
      this.result.teamBScore = b;
    }
  }
}
