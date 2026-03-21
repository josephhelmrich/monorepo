import { selectEventKey } from './../../store/five-hundred.selectors';
import { EventBaseComponent } from './../event-base/event-base.component';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-copy-event',
  templateUrl: './copy-event.component.html',
  styleUrls: ['./copy-event.component.scss']
})
export class CopyEventComponent extends EventBaseComponent {

  getEventUrl(): string {
    if (this.appState?.eventKey)
      return `${environment.webUrl}?eventKey=${this.appState?.eventKey}&view=Join`;
    else
      return "";
  }

}
