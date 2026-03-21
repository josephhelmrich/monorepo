import { UserModel } from '../../models/event.model';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { EventBaseComponent } from '../event-base/event-base.component';
import * as moment from 'moment';
import * as appStore from '../../store';
import * as models from '../../models/event.model';
import { SingleChadComponent } from '../single-chad/single-chad.component';
import { SelectChadUserComponent } from '../select-chad-user/select-chad-user.component';

@Component({
  selector: 'app-chad-list',
  templateUrl: './chad-list.component.html',
  styleUrls: ['./chad-list.component.scss']
})
export class ChadListComponent extends EventBaseComponent {

  getDate(dtIn: string|null) {
    if (!dtIn)
      return null;
    return new Date(dtIn);
  }

  sendChad() {
    var dialog = this.dialogService.open(SelectChadUserComponent);
    var sub = dialog.afterClosed().subscribe((user:models.UserModel|null) => {
      if (user?.id)
        this.store.dispatch(appStore.sendChadAction({recipientId: user.id}));

      sub.unsubscribe();
    });

  }

  showChad(chad: models.FuckingChadModel) {
    var dialog = this.dialogService.open(SingleChadComponent, { data: { chad: chad }, panelClass: 'custom-dialog-container'});
    var sub = dialog.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

}

