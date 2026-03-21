import { EventBaseComponent } from './../event-base/event-base.component';
import { Component, Input, OnInit, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { UserModel } from './../../models/event.model';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectUserComponent extends EventBaseComponent {

  @Input('user')
  get user(): UserModel|null{
    return this._user;
  }
  set user(value: UserModel|null){
    this._user = value;
    this.userChange.emit(this._user);
  }
  private _user: UserModel|null = null;

  @Output() userChange = new EventEmitter<UserModel|null>();
}
