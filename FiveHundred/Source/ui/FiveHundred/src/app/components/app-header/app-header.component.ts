import { CopyEventComponent } from './../copy-event/copy-event.component';
import { EventBaseComponent } from './../event-base/event-base.component';
import { StartGameComponent } from './../start-game/start-game.component';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import * as models from '../../models/event.model';
import * as appStore from '../../store';
import { SelectChadUserComponent } from '../select-chad-user/select-chad-user.component';
import { Store } from '@ngrx/store';
import { ViewMode } from '../../store';
import { SettingsComponent } from '../settings/settings.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { RefreshService } from 'src/app/shared/refresh.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent extends EventBaseComponent {

  constructor(
    store: Store<appStore.FiveHundredState>,
    route: ActivatedRoute,
    dialogService: MatDialog,
    common: CommonService,
    router: Router,
    public refreshService: RefreshService) {
      super(store, route, dialogService, common, router);
    }

  currentUser: string = "";
  showChads: boolean = false;

  private startGameSubscription: Subscription|null = null;


  protected override appStateChanged(): void {
    if (this.event && this.appState?.userKey) {
      this.showChads = (this.event.users.find(x => x.name.toUpperCase() === 'CHAD') == undefined);
      var u = this.event.users.find(x => x.id == this.appState?.userKey);
      if (u)
        this.currentUser = " - " + u.name;
    }
    // allows child components to capture change event
  }

  refresh() {
    this.store.dispatch(appStore.forceRefreshAction());
    this.refreshService.startRefresh();
  }

  startNewGame(){
    var dialogRef = this.dialogService.open(StartGameComponent, { data: { event: this.event }}); // , panelClass: 'custom-dialog-container'
    this.startGameSubscription = dialogRef.afterClosed().subscribe(option => {
      if (option?.length > 0) {
        let teams: models.TeamModel[] = []

        if (option === "RANDOM" || !(this.event?.currentGame?.teams.length == 2)) {
          teams = this.common.pickRandomTeams(this.event);
        }
        else {
          var teamA = this.event?.currentGame?.teams[0] ?? {};
          var teamB = this.event?.currentGame?.teams[1] ?? {};
          teams = [
            Object.assign({}, teamA),
            Object.assign({}, teamB)
          ];

          teams[0].score = 0;
          teams[1].score = 0;
        }

        if (teams == null || teams.length == 0) {
          throw new Error("Cannot start teams could be picked.  Try starting a new event");
        }

        this.store.dispatch(appStore.startGameAction({teams: teams}));
      }

      this.startGameSubscription?.unsubscribe();
    });
  }

  share(){
    this.dialogService.open(CopyEventComponent);
  }

  showNewGameAlert(): boolean{
    if (this.appState?.view === "Game") {
      if (!(this.event?.currentGame?.teams.length == 2))
        return false;
      var teamA = this.event?.currentGame?.teams[0].score;
      if (!teamA)
        teamA = 0;

      var teamB = this.event?.currentGame?.teams[1].score;
      if (!teamB)
        teamB = 0;

      var ws = this.event?.winningScore ?? 500;
      var ls = ws * -1;
      return (teamA >= ws || teamB >= ws || teamA <= ls || teamB <= ls ) ;
    }

    return false;
  }


  sendChad() {
    var dialog = this.dialogService.open(SelectChadUserComponent);
    var sub = dialog.afterClosed().subscribe((user:models.UserModel|null) => {
      if (user?.id)
        this.store.dispatch(appStore.sendChadAction({recipientId: user.id}));

      sub.unsubscribe();
    });
  }


  onSettings(): void {
    var dialog = this.dialogService.open(SettingsComponent);
    var sub = dialog.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  onQuit(): void {
    this.store.dispatch(appStore.resetAppAction());
    this.router.navigate([''], {queryParams: {view: ViewMode.Create}});
  }

}
