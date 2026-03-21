import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as models from '../../models/event.model';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss']
})
export class StartGameComponent implements OnInit {

  event: models.EventModel;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    this.event = data.event;
  }

  ngOnInit(): void {
  }

}
