import { EventBaseComponent } from './../event-base/event-base.component';
import { ViewMode } from './../../store/five-hundred.state';
import { UserModel } from './../../models/event.model';
import { Component, Input, OnInit } from '@angular/core';
import * as models from '../../models';
import { Router } from '@angular/router';


@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent extends EventBaseComponent {

  // @Input() users: models.UserModel[]|null = null;
  // @Input() eventKey: string|null = null;

  // constructor(private router: Router) { }

  // ngOnInit(): void {
  // }

  joinGame_Click(user: models.UserModel) {
    if (!user?.id) {
      return;
    }

    this.router.navigate(
      [],
      {
        queryParams: {
          eventKey: this.appState?.eventKey,
          userKey: user.id,
          view: ViewMode.Game
        },
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }
}
