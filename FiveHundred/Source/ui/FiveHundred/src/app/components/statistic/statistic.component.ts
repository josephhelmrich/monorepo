import { EventBaseComponent } from './../event-base/event-base.component';
import { Component, OnInit } from '@angular/core';
import * as models from '../../models/event.model';
import * as appStore from '../../store';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent extends EventBaseComponent implements OnInit {

  selectedGame: models.GameModel|null = null;
  games: models.GameModel[] = [];


  ngOnInit(): void {
    // using setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => this.reload());
  }

  reload(): void {
    //console.info(this.selectedGame?.id);
    this.store.dispatch(appStore.getStatisticsAction({gameId: this.selectedGame?.id ?? null}));
  }

  protected override eventChanged(): void {
    let g: models.GameModel[] = [];
    if (this.event?.pastGames && this.event.pastGames.length > 0)
      this.event.pastGames.forEach(x => {
        if (x.pastHands.length > 0)
          g.push(x);
      });
    if (this.event?.currentGame && this.event.currentGame.pastHands.length > 0)
      g.push(this.event.currentGame);

    this.games = g;

    if (this.selectedGame == null && this.games.length > 0)
      this.selectedGame = this.games[this.games.length-1];
  }

  gameSelected(e: any){
    this.selectedGame = e;
    this.reload();
  }
}
