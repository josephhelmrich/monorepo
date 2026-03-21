import { ViewMode } from './../store/five-hundred.state';
import { Injectable, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as appStore from '../store'
import * as models from "../models";

@Injectable({
  providedIn: 'root'
})
export class RefreshService implements OnDestroy {

  private parmSubscription: Subscription|null = null;
  timerId: any|null = null;
  evtSubscription: Subscription|null;
  refreshSuspended: boolean = false;
  private latestModel: models.EventModel|null = null;

  constructor(
    private store: Store<appStore.FiveHundredState>,
    private route: ActivatedRoute
    ) {
      setTimeout(() => {
        this.parmSubscription = this.route.queryParams.subscribe(parms => {
          var userKey = parms['userKey'];
          if (userKey == '')
            userKey = null;
          var eventKey = parms['eventKey'];
          if (eventKey == '')
            eventKey = null;

          var view = parms['view'];
          if (view == '')
            view = null;

          if (view == null && eventKey == null)
            view = ViewMode.Create;

          if (view!=null) {
            setTimeout(() => {
              this.store.dispatch(appStore.setViewAction({view: view}));
            });
          }

          if (eventKey && !userKey) {
            setTimeout(() => {
              this.store.dispatch(appStore.updateEventKeyAction({eventKey: eventKey}));
            });
            return;
          }
          else if (eventKey && userKey) {
            setTimeout(() => {
              this.store.dispatch(appStore.updateUserKeyAction({ eventKey: eventKey, userKey: userKey}));
            });
            return;
          }
        });
      }, 100);


      this.evtSubscription = this.store.pipe(select(appStore.selectEvent)).subscribe(x => { this.latestModel = x; });
      this.startRefresh();
  }

  ngOnDestroy(): void {
    this.stopRefresh();

    if (this.parmSubscription) {
      this.parmSubscription.unsubscribe();
      this.parmSubscription = null;
    }

    if (this.evtSubscription != null) {
      this.evtSubscription.unsubscribe();
      this.evtSubscription = null;
    }
  }


  startRefresh() {
    if (this.refreshSuspended) {
      console.info("Updates restarted");
    }

    this.refreshSuspended = false;
    if (this.timerId == null)
      this.timerId = setInterval(this.refresh, 2000, this);
  }

  private stopRefresh() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private refresh(component: RefreshService) {
    if (component.latestModel?.updated) {
      var lastUpdate = new Date(component.latestModel.updated).getTime();
      var currentTime = new Date().getTime();
      var ageInMs = currentTime - lastUpdate;
      // after 30 minutes without any updates, route back to the home page
      if (ageInMs > 1800000) {
      //if (ageInMs > 30000) {
        console.info("Inactive... Stopped Update Timer");
        component.refreshSuspended = true;
        component.stopRefresh();
        return;
      }
    }

    // check for updates from the API
    component.store.dispatch(appStore.refreshEventAction());
  }
}
