import { EventBaseComponent } from './../event-base/event-base.component';
import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as models from '../../models/event.model';
import * as appStore from '../../store'
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends EventBaseComponent implements OnInit, AfterContentInit {

  invalid: boolean = false;
  scoreControl = new UntypedFormControl('', [Validators.min(1), Validators.max(1999), Validators.required]);

  muted: boolean = false;
  nilAlone: boolean = false;

  constructor(
    store: Store<appStore.FiveHundredState>,
    route: ActivatedRoute,
    dialogService: MatDialog,
    common: CommonService,
    router: Router,
    private dialog: MatDialog) {
      super(store, route, dialogService, common, router);
  }

  ngAfterContentInit(): void {
    this.appStateChanged();
  }

  ngOnInit(): void {
    this.scoreControl.setValue(this.event?.winningScore ?? 500);
    this.nilAlone = this.event?.nilAlone ?? false;
  }

  onSubmit(): void {
    if (this.scoreControl.invalid) return;

    var score = Number(this.scoreControl.value);
    this.store.dispatch(appStore.updateSettingsAction({score: score, muted: this.muted, nilAlone: this.nilAlone}));

    this.dialog.closeAll();
  }

  setMuted(value: any){
    this.muted = value.checked;
  }

  setNilAlone(value: any){
    this.nilAlone = value.checked;
  }

  override appStateChanged(){
    this.muted = this.appState?.muted ?? appStore.initialState.appState.muted;
  }
}
