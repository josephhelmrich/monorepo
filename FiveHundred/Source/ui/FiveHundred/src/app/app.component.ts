import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { RefreshService } from './shared/refresh.service';
import * as appStore from './store'
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {

  isBusy: boolean|null = false;
  title = 'FiveHundred';
  isBusySubscription: Subscription|null;

  constructor(
    private store: Store<appStore.FiveHundredState>,
    private refresher: RefreshService,
    private cookieService: CookieService
    ){
    this.isBusySubscription = this.store.pipe(select(appStore.selectAppState)).subscribe(x => {
      this.isBusy = x.appBusy;
    });

    this.refresher.startRefresh();
    this.store.dispatch(appStore.loadSettingsAction());
  }
  ngOnInit(): void {
    console.info("getting cookies");
    this.cookieService.set("someCookie", "value", new Date(2024,12,31), "/", "localhost", false);
    this.cookieService.set("cookieToKeep", "value", new Date(2024,12,31), "/", "localhost", false);
    var cookies = this.cookieService.getAll();
    for (let key in cookies) {
      console.info(cookies[key]);

      if (key != 'cookieToKeep') {
        this.cookieService.delete(key);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.isBusySubscription) {
      this.isBusySubscription.unsubscribe();
      this.isBusySubscription = null;
    }
  }
}
