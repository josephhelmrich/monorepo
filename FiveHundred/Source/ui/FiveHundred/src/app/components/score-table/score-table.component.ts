import { AdjustScoreComponent } from './../adjust-score/adjust-score.component';
import { EventBaseComponent } from './../../components/event-base/event-base.component';
import { Component, OnInit } from '@angular/core';
import * as appStore from '../../store';
import * as models from '../../models/event.model';


@Component({
  selector: 'app-score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss']
})
export class ScoreTableComponent extends EventBaseComponent implements OnInit {

  ngOnInit(): void {

  }

  adjustScore(h: models.HandModel): void {
    var dialog = this.dialogService.open(AdjustScoreComponent, { data: { hand: h, event: this.event }});
    var sub = dialog.afterClosed().subscribe((request:models.AdjustScoreRequest|null) => {
      if (request)
        this.store.dispatch(appStore.adjustScoreAction({request: request}));

      sub.unsubscribe();
    });
  }

  isTeamA(hand: models.HandModel) {
    return hand.bidTeamId == this.event?.currentGame?.teams[0].id;
  }


  isTeamB(hand: models.HandModel) {
    return hand.bidTeamId == this.event?.currentGame?.teams[1].id;
  }

  getBidUsername(hand: models.HandModel) {
    return this.event?.users.find(x => x.id == hand.bidUserId)?.name;
  }
}
