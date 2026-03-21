import { ApiClientModule } from './clients/api-client.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import * as appStore from './store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MainComponent } from './components/main/main.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CreateComponent } from './components/create/create.component';
import { JoinComponent } from './components/join/join.component';
import { EventComponent } from './components/event/event.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CopyEventComponent } from './components/copy-event/copy-event.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { BidComponent } from './components/bid/bid.component';
import { ScoreComponent } from './components/score/score.component';
import { StartGameComponent } from './components/start-game/start-game.component';
import { HardErrorComponent } from './components/hard-error/hard-error.component';
import { ScoreTableComponent } from './components/score-table/score-table.component';
import { EventBaseComponent } from './components/event-base/event-base.component';
import { GameScoreComponent } from './components/game-score/game-score.component';
import { AdjustScoreComponent } from './components/adjust-score/adjust-score.component';
import { SuitIconComponent } from './components/suit-icon/suit-icon.component';
import { ChadListComponent } from './components/chad-list/chad-list.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SelectUserComponent } from './components/select-user/select-user.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SingleChadComponent } from './components/single-chad/single-chad.component';
import { SelectChadUserComponent } from './components/select-chad-user/select-chad-user.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SpinnerComponent,
    CreateComponent,
    JoinComponent,
    EventComponent,
    CopyEventComponent,
    AppHeaderComponent,
    BidComponent,
    ScoreComponent,
    StartGameComponent,
    HardErrorComponent,
    ScoreTableComponent,
    EventBaseComponent,
    GameScoreComponent,
    AdjustScoreComponent,
    SuitIconComponent,
    ChadListComponent,
    SettingsComponent,
    SelectUserComponent,
    SingleChadComponent,
    SelectChadUserComponent,
    StatisticComponent,
    BackButtonComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    ScrollingModule,
    CommonModule,
    StoreModule.forRoot(appStore.reducers.app, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    EffectsModule.forRoot([appStore.FiveHundredEffects]),
    environment.enableReduxDevTools ? StoreDevtoolsModule.instrument({
      name: 'FiveHundred DevTools',
      maxAge: 25,
      logOnly: environment.production
    , connectInZone: true}) : [],
    StoreModule.forFeature(appStore.fiveHundredFeatureKey, appStore.reducers.app),
    ApiClientModule.forRoot(environment.apiUrl)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
