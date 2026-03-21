import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as models from "../../models/event.model";
import * as appStore from '../../store'
import { EventBaseComponent } from '../event-base/event-base.component';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent extends EventBaseComponent implements OnInit {
  result: models.Scoring = {
    actualTricks: null,
    partnerTricks: null
  };

  bidModel: models.BidModel;

  disabled: boolean = true;
  nilAlone: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    store: Store<appStore.FiveHundredState>,
    route: ActivatedRoute,
    dialogService: MatDialog,
    common: CommonService,
    router: Router
    ) {

      super(store, route, dialogService, common, router);
      this.bidModel = data.bid;
  }

  ngOnInit(): void {
    this.eventChanged();
  }

  protected override eventChanged(): void {
      this.nilAlone = this.event?.nilAlone ?? false;
      if (this.nilAlone) {
        this.setPartnerTricks(10);
      }
  }

  setActualTricks(tricks: number) {
    this.result.actualTricks = tricks;
    this.validate();
  }

  setPartnerTricks(tricks: number) {
    this.result.partnerTricks = tricks;
    this.validate();
  }

  private validate() {
    this.disabled = (this.result.actualTricks == null);
    if (this.bidModel.suit == models.Suit.nil && this.event?.nilAlone != true)
      this.disabled = this.disabled || (this.result.partnerTricks == null);
  }

}
