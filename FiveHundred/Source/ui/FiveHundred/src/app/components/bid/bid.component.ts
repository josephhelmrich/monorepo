import { CommonService } from './../../shared/common.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as models from "../../models/event.model";

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.scss']
})
export class BidComponent implements OnInit {

  users: models.UserModel[];
  selectedUser: models.UserModel|null = null;
  teamA: models.ScoringModel|null = null;
  teamB: models.ScoringModel|null = null;

  bidModel: models.BidModel ={
    bid: 0,
    suit: null,
    potentialScore: 0,
    userKey: ""
  };
  disabled: boolean = true;
  suitString: string = "";

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private common: CommonService) {
    if (!(data?.event))
      throw new Error("Event must be passed to the bid component");
     if (data?.event?.users)
       this.users = data.event?.users;
    else
      throw new Error("Event must be passed to the bid component");

    if (data?.event) {
      var teams = common.getTeamsModel(data.event);
      if (teams && teams.length == 2) {
        this.teamA = teams[0];
        this.teamB = teams[1];

        if (teams[0].userA && teams[0].userB && teams[1].userA && teams[1].userB)
        this.users = [
          teams[0].userA,
          teams[0].userB,
          teams[1].userA,
          teams[1].userB
        ]
      }
    }
  }

  ngOnInit(): void {
  }

  setUser(user: models.UserModel|null|undefined): void {
    if (!user)
      return;

    this.bidModel.userKey = user?.id ?? "";
    this.validate();
  }

  setSuit(suit: string): void {
    this.bidModel.suit = <models.Suit> suit;
    this.suitString = this.bidModel.suit.toString();
    if (this.bidModel.suit == models.Suit.nil)
      this.bidModel.bid = 0;


    this.validate();
  }

  setBid(b: number): void {
    this.bidModel.bid = b;
    this.validate();
  }

  private validate(): void {
    if (this.bidModel.userKey == "") {
      this.disabled = true;
      return;
    }

    if (this.bidModel.suit == models.Suit.nil)
      this.disabled = false;
    else
      this.disabled = !(this.bidModel.suit != null && this.bidModel.bid > 5 && this.bidModel.bid < 11);
  }
}
