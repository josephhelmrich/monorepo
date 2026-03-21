import { Component, Input, OnInit } from '@angular/core';
import * as models from '../../models/event.model';

@Component({
  selector: 'app-suit-icon',
  templateUrl: './suit-icon.component.html',
  styleUrls: ['./suit-icon.component.scss']
})
export class SuitIconComponent implements OnInit {

  @Input('suit')
  get suit(): models.Suit|null|undefined {
    return this._suit;
  }
  set suit(value: models.Suit|null|undefined) {
    this._suit = value;
    this.updateImageUrl();
  }
  private _suit: models.Suit|null|undefined = null;

  @Input() width: string = "15";

  imageUrl: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  protected updateImageUrl() {
    if (this.suit == models.Suit.spades)
      this.imageUrl = "/assets/spades.png";
    else if (this.suit == models.Suit.clubs)
      this.imageUrl = "/assets/clubs.png";
    else if (this.suit == models.Suit.diamonds)
      this.imageUrl = "/assets/diamonds.png";
    else if (this.suit == models.Suit.hearts)
      this.imageUrl = "/assets/hearts.png";
    else if (this.suit == models.Suit.noTrump)
      this.imageUrl = "/assets/notrump.png";
    else
      this.imageUrl = "";
  }

}
