import { EventBaseComponent } from './../event-base/event-base.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy, Inject, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as appStore from '../../store';
import * as models from '../../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-single-chad',
  templateUrl: './single-chad.component.html',
  styleUrls: ['./single-chad.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SingleChadComponent implements OnInit, OnDestroy {

  constructor (
    @Inject(MAT_DIALOG_DATA) data: any,
    private store: Store<appStore.FiveHundredState>,
    private dialogService: MatDialog
    )
  {
    this.appStateSubscription = this.store.pipe(select(appStore.selectAppState)).subscribe(x => {
      this.appState = x;
    });
    this.chad = data.chad;

  }

  appState: appStore.ApplicationState = appStore.initialState.appState;
  appStateSubscription: Subscription|null;
  chad: models.FuckingChadModel;
  private timer: any|null = null;
  trackUrl?: string = undefined;
  availableTracks: string[] = [
    '/assets/chad_sound_track_BestImTold.mp3',
    '/assets/chad_sound_track_DigIt.mp3',
    '/assets/chad_sound_track_EveryDay.mp3',
    '/assets/chad_sound_track_hits.mp3',
    '/assets/chad_sound_track_HowdyDoody.mp3',
    '/assets/chad_sound_track_HowdyHo.mp3',
    '/assets/chad_sound_track_ImSoWasted.mp3',
    '/assets/chad_sound_track_LetsParty.mp3',
    '/assets/chad_sound_track_Mufucka.mp3',
    '/assets/chad_sound_track_OnDope.mp3',
    '/assets/chad_sound_track_Sanford.mp3',
    '/assets/chad_sound_track_SayMan.mp3',
    '/assets/chad_sound_track_ThoseGuys.mp3',
    '/assets/chad_sound_track_TrueWisdom.mp3',
    '/assets/chad_sound_track_TowellieAddicted.mp3',
    '/assets/chad_sound_track_TowellieChangSauce.mp3',
    '/assets/chad_sound_track_TowellieIdeas.mp3',
    '/assets/chad_sound_track_TowellieWannaGetHi.mp3',
    '/assets/chad_sound_track_TowellieNodIdea.mp3',
    '/assets/chad_sound_track_TowellieAddicted.mp3',
    '/assets/chad_sound_track_TowellieChangSauce.mp3',
    '/assets/chad_sound_track_TowellieIdeas.mp3',
    '/assets/chad_sound_track_TowellieWannaGetHi.mp3',
    '/assets/chad_sound_track_TowellieNodIdea.mp3',
  ]

  ngOnInit(): void {

    if (!this.appState.muted) {
      var index = Math.ceil(Math.random() * 1000) % this.availableTracks.length;
      this.trackUrl = this.availableTracks[index];
    }

    this.timer = setTimeout(()=> this.dialogService.closeAll(), 20000);
  }

  ngOnDestroy(): void {

    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
    }
      this.appStateSubscription = null;
    if (this.timer != null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
