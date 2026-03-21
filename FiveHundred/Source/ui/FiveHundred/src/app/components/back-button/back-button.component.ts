import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnDestroy {
  visible: boolean = true;
  private openedSub: Subscription;
  private closedSub: Subscription;

  constructor (public dialogService: MatDialog) {
    this.openedSub = this.dialogService.afterOpened.subscribe(x => {
      this.visible = false;
    });

    this.closedSub = this.dialogService.afterAllClosed.subscribe(x => {
      this.visible = true;
    });
  }
  ngOnDestroy(): void {
    this.openedSub.unsubscribe();
    this.closedSub.unsubscribe();
  }
}
