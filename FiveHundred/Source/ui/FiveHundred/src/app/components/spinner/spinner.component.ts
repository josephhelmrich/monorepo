import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  // animations: [
  //   trigger('ngIfAnimation', [
  //     transition(':enter, :leave', [
  //       query('@*', animateChild())
  //     ])
  //   ]),
  //   trigger('fadePanel', [
  //     transition(':enter', [
  //       style({ 'opacity': '0' }),
  //       query('.p-container', style({ opacity: 0, transform: 'translateY(10px)' })),

  //       animate('330ms ease-in', style({ 'opacity': '1' })),
  //       query('.p-container', [

  //         animate('230ms ease', style({ opacity: 1, transform: 'translateY(0px)' })),

  //       ])
  //     ]),
  //     transition(':leave', [
  //       animate('230ms ease-in', style({ 'opacity': '0' })),
  //       query('.p-container', [

  //         animate('330ms ease-in', style({ 'opacity': '0', transform: 'translateY(-10px)' })),

  //       ])
  //     ])
  //   ]),
  // ]
})
export class SpinnerComponent implements OnInit {
  @Input('showLoader') showLoader: boolean|null = false;
  constructor() { }

  ngOnInit(): void {
  }

}
