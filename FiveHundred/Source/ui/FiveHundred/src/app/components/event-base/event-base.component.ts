import { CommonService } from './../../shared/common.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';import { select, Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import * as models from '../../models/event.model';
import * as appStore from '../../store'

@Component({
  selector: 'app-event-base',
  templateUrl: './event-base.component.html',
  styleUrls: ['./event-base.component.scss']
})
export class EventBaseComponent implements OnDestroy  {
  event: models.EventModel|null = null;
  appState: appStore.ApplicationState|null = null;

  protected subscriptions: Subscription[] = [];

  constructor(
    protected store: Store<appStore.FiveHundredState>,
    protected route: ActivatedRoute,
    protected dialogService: MatDialog,
    protected common: CommonService,
    protected router: Router)
  {
    this.subscribe(this.store.pipe(select(appStore.selectEvent)), x => {
      this.event = x;
      this.eventChanged();
    });
    this.subscribe(this.store.pipe(select(appStore.selectAppState)), x => {
      this.appState = x;
      this.appStateChanged();
    });
  }

  protected subscribe<T>(observed: Observable<T>, next: (value: T) => void){
    var sub = observed.subscribe(next);
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x =>{
      x.unsubscribe();
    });
    this.subscriptions = [];
  }

  protected eventChanged(): void {
    // allows child components to capture change event
  }


  protected appStateChanged(): void {
    // allows child components to capture change event
  }

}
