import { EventBaseComponent } from './../event-base/event-base.component';
import { UserModel } from './../../models/event.model';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as appStore from '../../store'
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-select-chad-user',
  templateUrl: './select-chad-user.component.html',
  styleUrls: ['./select-chad-user.component.scss']
})
export class SelectChadUserComponent extends EventBaseComponent {

  selectedUser: UserModel|null=null;
// public

  constructor(
    store: Store<appStore.FiveHundredState>,
    route: ActivatedRoute,
    dialogService: MatDialog,
    common: CommonService,
    router: Router,
    private dialogRef: MatDialogRef<SelectChadUserComponent>)
    {
    super(store, route, dialogService, common, router);
  }

  userChanged(value: UserModel|null){
    this.close(value);
  }

  close(value: UserModel|null=null) {
    if (value)
      this.dialogRef.close(value);
    else
      this.dialogRef.close();
  }
}
