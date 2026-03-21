import { Router } from '@angular/router';
import { ViewMode } from './five-hundred.state';
import { SingleChadComponent } from './../components/single-chad/single-chad.component';
import { HardErrorComponent } from './../components/hard-error/hard-error.component';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { act, Actions, createEffect, ofType } from '@ngrx/effects';
import {  Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, debounceTime, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import * as appStore from './';
import * as models from '../models/event.model'
import * as constants from '../app-constants'
import { ApiClient } from '../clients/api-client';
import { selectAll } from './';
import { selectAppState, selectEvent } from './five-hundred.selectors';

@Injectable()
export class FiveHundredEffects {

  // called on on the /diganostic page to get diagostic data from the BFF
  createEventEffect$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.createEventAction),
      switchMap((action) => {
        // call bff to get data for startup
        return this.apClient.post<models.EventModel>("event", action.request).pipe(
          map((json) => {
            return appStore.enterEventAction({ response: json, didCreate: true });
          }),
          catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage })))
        );
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );

  // called on on the /diganostic page to get diagostic data from the BFF
  loadRecentEvents$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.startLoadRecentAction),
      switchMap((action) => {
        // GET /api/event/recent
        // call bff to get data for startup
        return this.apClient.get<models.RecentEventModel[]>("event/recent").pipe(
          map((json) => {
            return appStore.recentLoadedAction({ events: json });
          }),
          catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage })))
        );
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );

  // called on on the /diganostic page to get diagostic data from the BFF
  initJoinEffect$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.updateEventKeyAction),
      switchMap((action) => {
        return this.apClient.get<models.EventModel>(`event/${action.eventKey}`).pipe(
          map((evt) => {
            return appStore.loadUsersAction({ users: evt.users });
          }),
          catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage })))
        );
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );



  // called on on the /diganostic page to get diagostic data from the BFF
  joinEventEffect$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.updateUserKeyAction),
      switchMap((action) => {
        return this.apClient.put<models.EventModel>(`event/join/`, {
          userId: action.userKey,
          eventId: action.eventKey
        }).pipe(
          map((evt) => {
            return appStore.enterEventAction({ response: evt, didCreate: false });
          }),
          catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage })))
        );
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );

  // called on on the /diganostic page to get diagostic data from the BFF
  sendChadEffect$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.sendChadAction),
      withLatestFrom(this.store.select(selectAll)),
      switchMap(([action, all]) => {
        var url: string = `event/fucking-chad?eventId=${all.appState?.eventKey}&fromUserId=${all.appState?.userKey}&toUserId=${action.recipientId}`;
        return this.apClient.post<models.EventModel>(url).pipe(
          map((evt) => {
            return appStore.eventRefreshedAction({ response: evt });
          }),
          catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage })))
        );
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );


  // called on on the /diganostic page to get diagostic data from the BFF
  setWinningScoreEffect$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.updateSettingsAction),
      withLatestFrom(this.store.select(selectAll)),
      switchMap(([action, all]) => {
        var url: string = `event/update-settings?eventId=${all.appState?.eventKey}&score=${action.score}&nilAlone=${action.nilAlone}`;
        return this.apClient.put<models.EventModel>(url).pipe(
          map((evt) => {
            return appStore.eventRefreshedAction({ response: evt });
          }),
          catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage })))
        );
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );




  // called on on the /diganostic page to get diagostic data from the BFF
  bidEventEffect$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.enterBidAction),
      withLatestFrom(this.store.select(selectAll)),
      switchMap(([action, all]) => {
        return this.apClient.put<models.EventModel>(`game/bid/`, {
          userId: action.bid.userKey,
          eventId: all.appState?.eventKey,
          suit: action.bid.suit,
          bid: action.bid.bid
        }).pipe(
          map((evt) => {
            return appStore.bidSavedAction({ response: evt });
          }),
          catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage })))
        );
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );

  // called on on the /diganostic page to get diagostic data from the BFF
  refreshEffect$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.refreshEventAction),
      withLatestFrom(this.store.select(selectEvent)),
      switchMap(([action, event]) => {
        if (!event)
          return of(appStore.noActionNeededAction());

        return this.apClient.get<models.EventModel>(`event/refresh/${event?.id}/${event?.versionNumber}`).pipe(
          map((evt) => {
            if (evt) // the API returns null if there are no update
              return appStore.eventRefreshedAction({ response: evt });
            else
              return appStore.noActionNeededAction();
          })
          //,catchError(err => of(appStore.ignoreErrorAction({ error: err })))
        );
      })
      //,catchError(err => of(appStore.ignoreErrorAction({ error: err }))),
    )
  );


  // called on on the /diganostic page to get diagostic data from the BFF
  startGameEffect$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.startGameAction),
      withLatestFrom(this.store.select(selectAll)),
      switchMap(([action, all]) => {
        return this.apClient.put<models.EventModel>(`game/start/`, {
          eventId: all.appState?.eventKey,
          teamA: action.teams[0],
          teamB: action.teams[1]
        }).pipe(
          map((evt) => {
            return appStore.gameStartedAction({ response: evt });
          }),
          catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage })))
        );
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );



  enterScoreEffect$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.enterScoreAction),
      switchMap((action) => {
        return this.apClient.put<models.EventModel>(`game/score/`, action.score).pipe(
          map((evt) => {
            return appStore.scoreSavedAction({ response: evt });
          }),
          catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage })))
        );
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );

  eventUpdatedEvent$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.eventRefreshedAction),
      withLatestFrom(this.store.select(selectAll)),
      switchMap(([action, all]) => {
        if (all.appState.latestChad && (all.appState.view != ViewMode.Chads || all.appState.latestChad.fromUserId != all.appState.userKey)) {
          var dialog = this.dialogService.open(SingleChadComponent, { data: { chad: all.appState.latestChad }, panelClass: 'custom-dialog-container', disableClose: false });
        }
        return of(appStore.noActionNeededAction());
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );

  adjustScoreEffect$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.adjustScoreAction),
      switchMap((action) => {
        return this.apClient.put<models.EventModel>(`game/score/adjust/`, action.request).pipe(
          map((evt) => {
            return appStore.eventRefreshedAction({ response: evt });
          }),
          catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage })))
        );
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );

  hardErrorEffect$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.hardErrorAction),
      switchMap((action) => {
        this.dialogService.open(HardErrorComponent, {data: action, disableClose: true})
          .afterClosed().subscribe((x) => {
            this.router.navigate([""], {queryParams: {view: ViewMode.Create}});
          });
        return of(appStore.resetAppAction());
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );


  // called on on the /diganostic page to get diagostic data from the BFF
  getStatsEffect$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.getStatisticsAction),
      withLatestFrom(this.store.select(selectAll)),
      switchMap(([action, all]) => {
        var url: string = `event/stats?eventId=${all.appState?.eventKey}`;
        if (action.gameId != null && action.gameId.length > 4)
          url += `&gameId=${action.gameId}`

        return this.apClient.get<models.StatisticsModel>(url).pipe(
          map((result) => {
            return appStore.getStatisticsSuccessAction({ stats: result });
          }),
          catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage })))
        );
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );



  // called on on the /diganostic page to get diagostic data from the BFF
  forceRefreshEffect$ = createEffect(
    () => this.actions$.pipe(
      ofType(appStore.forceRefreshAction),
      withLatestFrom(this.store.select(selectAppState)),
      switchMap(([action, all]) => {
        var url: string = `event/refresh/${all.eventKey}/force`;

        return this.apClient.get<models.EventModel>(url).pipe(
          map((result) => {
            return appStore.eventRefreshedAction({ response: result });
          }),
          catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage })))
        );
      }),
      catchError(err => of(appStore.hardErrorAction({ error: err, userMessage: constants.GenericErrorMessage }))),
    )
  );


  constructor(private actions$: Actions,
    private store: Store<appStore.FiveHundredState>,
    private apClient: ApiClient,
    private dialogService: MatDialog,
    private router: Router
  ) { }
}


