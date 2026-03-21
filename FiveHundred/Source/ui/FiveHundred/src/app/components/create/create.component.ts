import { recentLoadedAction } from './../../store/five-hundred.actions';
import { CopyEventComponent } from './../copy-event/copy-event.component';
import { ViewMode } from './../../store/five-hundred.state';
import { EventBaseComponent } from './../event-base/event-base.component';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {UntypedFormControl, Validators} from '@angular/forms';
import * as appStore from '../../store'
import * as models from "../../models";
import { select } from '@ngrx/store';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends EventBaseComponent implements OnInit {
  // @Input() eventKey: string|null = "";
  // @Input() userKey: string|null = null;
  // @Output() onCreateGame = new EventEmitter<CreateRequestModel>();

  nameFormControl = new UntypedFormControl('', [Validators.required]);
  othersFormControl = new UntypedFormControl('', [Validators.required]);

  invalid: boolean = true;
  recentEvents: models.RecentEventModel[] = [];
  private lastEventKey: string = "";
  private didCreate: boolean = false;

  protected override appStateChanged(): void {
    if (this.appState?.eventKey != null && this.didCreate == true && this.appState?.eventKey != this.lastEventKey) {
      this.lastEventKey = this.appState?.eventKey;
      const dialogRef = this.dialogService.open(CopyEventComponent);
        dialogRef.afterClosed().subscribe(x => {
          this.router.navigate(
            [],
            {
              queryParams: {
                eventKey: this.appState?.eventKey,
                userKey: this.appState?.userKey,
                view: ViewMode.Game
              },
              queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
        });
    }

    this.recentEvents = this.appState?.recentEvents ?? [];
    if (this.recentEvents.length > 0) {

    }
  }

  ngOnInit(): void {
    setTimeout(() => this.store.dispatch(appStore.startLoadRecentAction()));

  }

  createGame_Click(): void {
    if (this.nameFormControl.invalid || this.othersFormControl.invalid)
      return;

    this.didCreate = true;
    this.store.dispatch(appStore.createEventAction({request: {
      name: `${this.nameFormControl.value}'s game`,
      email: `${this.nameFormControl.value}@joefivehundo.com`,
      otherUsers: this.getOthers(),
      username: this.nameFormControl.value
    }}));
  }

  private getOthers(): string[] {
    if (!(this.othersFormControl?.value?.length > 0))
      return [];

      var result = this.othersFormControl.value.split(/\r?\n/);
      if (!result || result.length == 1)
        result = this.othersFormControl.value.split(/\s/);

      return result;
  }

  validate(): void {
    var others = this.getOthers();
    this.invalid = !(this.nameFormControl.value.length > 0 && others && others.length == 3);
  }

  getJoinLink(r: models.RecentEventModel) {
    return `/?eventKey=${r.id}&view=Join`;
  }
}
