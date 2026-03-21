import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-hard-error',
  templateUrl: './hard-error.component.html',
  styleUrls: ['./hard-error.component.scss']
})
export class HardErrorComponent implements OnInit {

  error: any;
  userMessage: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {
    this.error = data.error;
    this.userMessage = data.userMessage;
  }

  ngOnInit(): void {
  }

}
