import { EventBaseComponent } from './../event-base/event-base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from './../../shared/common.service';
import { ScoreComponent } from './../score/score.component';
import * as models from './../../models/event.model';
import * as appStore from '../../store'
import { BidComponent } from './../bid/bid.component';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RefreshService } from 'src/app/shared/refresh.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent extends EventBaseComponent {
  //@Input() event: models.EventModel|null = null;
  // @Output() onBid = new EventEmitter<models.BidModel>();
  // @Output() onPickTeams = new EventEmitter<models.TeamModel[]>();
  // @Output() onScore = new EventEmitter<models.ScoringRequestModel>();
  //private bidSubscription: Subscription|null=null;
  //private scoreSubscription: Subscription|null=null;

  currentHand: models.CurrentBidModel|null = null;
  suitString: string|null=null;
  forTheWin: boolean = false;
  loseIfSet: boolean = false;
  nilScore: number = 150;

  constructor(
    store: Store<appStore.FiveHundredState>,
    route: ActivatedRoute,
    dialogService: MatDialog,
    common: CommonService,
    router: Router,
    public refreshService: RefreshService)
  {
    super(store, route, dialogService, common, router);
  }

  // constructor(
  //   private dialogService: MatDialog,
  //   private common: CommonService
  //   ) {
  //    }

  ngOnInit(): void {
    if (this.event && this.event.currentGame == null && this.event.users?.length == 4) {
      this.pickNewTeams();
    }
  }

  private started: boolean = false;

  protected override eventChanged(): void {
    if (this.started == false && this.event && this.event.currentGame == null && this.event.users?.length == 4) {
      this.started = true;
      this.pickNewTeams();
    }

    if (this.event?.nilAlone === true) {
      this.nilScore = 250;
    }
    else {
      this.nilScore = 150;
    }

    var game = this.event?.currentGame;
    if (game?.currentHand) {
      var caller = this.event?.users.find(x => x.id == game?.currentHand?.bidUserId);

      if (caller) {
        this.currentHand = {
          bid: game.currentHand.bid,
          suit: game.currentHand.suit,
          player: caller.name,
          potentialScore: game.currentHand.potentialScore,
          userKey: game.currentHand.userKey
        };

        this.suitString = game.currentHand.suit?.toString() ?? "";
        if (this.suitString == "NoTrump")
          this.suitString = "No Trump";
      }

      var team = game.teams.find(x => x.id == game?.currentHand?.bidTeamId);
      if (team) {
        var scoreIfWon = team.score + game.currentHand.potentialScore;
        var scoreIfLost = team.score - game.currentHand.potentialScore;
        this.forTheWin = scoreIfWon >= (this.event?.winningScore ?? 500);
        this.loseIfSet = scoreIfLost <= (-1*(this.event?.winningScore ?? 500));
      }

    }
    else
      this.currentHand = null;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   var game = this.event?.currentGame;
  //   if (game?.currentHand) {
  //     var caller = this.event?.users.find(x => x.id == game?.currentHand?.bidUserId);

  //     if (caller) {
  //       this.currentHand = {
  //         bid: game.currentHand.bid,
  //         suit: game.currentHand.suit,
  //         player: caller.name,
  //         potentialScore: game.currentHand.potentialScore,
  //         userKey: game.currentHand.userKey
  //       };

  //       this.suitString = game.currentHand.suit?.toString() ?? "";
  //       if (this.suitString == "NoTrump")
  //         this.suitString = "No Trump";
  //     }

  //     var team = game.teams.find(x => x.id == game?.currentHand?.bidTeamId);
  //     if (team) {
  //       var scoreIfWon = team.score + game.currentHand.potentialScore;
  //       var scoreIfLost = team.score - game.currentHand.potentialScore;
  //       this.forTheWin = scoreIfWon >= (this.event?.winningScore ?? 500);
  //       this.loseIfSet = scoreIfLost <= (-1*(this.event?.winningScore ?? 500));
  //     }

  //   }
  //   else
  //     this.currentHand = null;
  // }

  pickNewTeams(): void {
    var teams = this.common.pickRandomTeams(this.event);
    if (teams && teams.length > 0) {
      this.refreshService.startRefresh();
      if (!teams || teams.length != 2) {
        console.error("Invalid teams");
        console.error(teams ?? []);
        return;
      }

      this.store.dispatch(appStore.startGameAction({teams: teams}));
    }
  }

  bid(): void {
    var dialogRef = this.dialogService.open(BidComponent, { data: { event: this.event }});
    var bidSubscription = dialogRef.afterClosed().subscribe(x => {
      let model: models.BidModel = <models.BidModel>x;
      if (model?.suit != null) {
        this.refreshService.startRefresh();
        this.store.dispatch(appStore.enterBidAction({bid: model}));
      }

      bidSubscription.unsubscribe();
    });
  }

  score(): void {
    if (this.currentHand) {
      var dialogRef = this.dialogService.open(ScoreComponent, { data: { bid: this.currentHand }});
      var scoreSubscription = dialogRef.afterClosed().subscribe(x => {
        let model = <models.Scoring>x;
        if (model) {
          if (this.currentHand?.suit != models.Suit.nil)
            model.partnerTricks = 0;

          let request: models.ScoringRequestModel = {
            actualTricks: model.actualTricks,
            partnerTricks: model.partnerTricks,
            eventId: this.event?.id ?? ""
          }

          this.refreshService.startRefresh();
          this.store.dispatch(appStore.enterScoreAction({score: request}));

        }

        scoreSubscription.unsubscribe();
      });
    }
  }




}
