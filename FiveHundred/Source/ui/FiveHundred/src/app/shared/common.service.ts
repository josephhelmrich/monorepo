import { Injectable } from '@angular/core';
import * as models from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }


  private randomNumber(max:number) {
    return Math.floor(Math.random() * max);
  }

  pickRandomTeams(event: models.EventModel|null): models.TeamModel[] {
    if (event && event.users?.length == 4) {
      let users: (string|null)[] = [event.users[0].id, event.users[1].id, event.users[2].id, event.users[3].id];
      let teamArray: string[] = [];
      let index: number = -1;

      while(teamArray.length < 4) {
        index = this.randomNumber(users.length);
        teamArray.push(users[index] ?? "");
        users.splice(index, 1);
      }

      let model: models.TeamModel[] = [
        {
          name: "",
          userIds: [teamArray[0],teamArray[1]],
          id: null,
          score: 0
        },
        {
          name: "",
          userIds: [teamArray[2],teamArray[3]],
          id: null,
          score: 0
        }
      ]

      return model;
    }

    return [];
  }


  getTeamsModel(event: models.EventModel|null): models.ScoringModel[] {
    let result: models.ScoringModel[] = [];

    if (!(event?.currentGame?.teams.length == 2))
      return result;

    event.currentGame.teams.forEach(team => {
      let m: models.ScoringModel = {
        model: team,
        score: team.score,
        playerA: "",
        playerB: "",
        userA: null,
        userB: null
      };

      var user = event.users.find(x => x.id == team.userIds[0]);
      if (user) {
        m.playerA = user.name;
        m.userA = user;
      }

      user = event.users.find(x => x.id == team.userIds[1]);
      if (user) {
        m.playerB = user.name;
        m.userB = user;
      }

      result.push(m);
    });

    return result;
  }

}
