import { BidModel } from './../models/event.model';
import * as models from '../models';

export interface State {
  application: FiveHundredState;
}

// Main Redux State Definition
export interface FiveHundredState {
  // triggers the spinner icon for the entire app
  //appBusy: boolean;
  // contains hard errors (ones that block the user)
  hardError: models.ErrorModel|null;
  eventError: models.ErrorModel|null;
  gameError: models.ErrorModel|null;
  // contains soft errors (ones where the user can still use the app)
  //softErrorMessage: model.ApplicationMessageModel|null;

  event: models.EventModel|null;
  //eventKey: string|null;
  //userKey: string|null;
  //userList: models.UserModel[];
  //didCreate: boolean;
  //currentBid: BidModel|null;
  //latestChad: models.FuckingChadModel|null;
  appState: ApplicationState;
}

export interface ApplicationState {
  view: string;
  eventKey: string|null;
  userKey: string|null;
  userList: models.UserModel[];
  didCreate: boolean;
  currentBid: BidModel|null;
  latestChad: models.FuckingChadModel|null;
  appBusy: boolean;
  stats: models.StatisticsModel;
  muted: boolean;
  recentEvents: models.RecentEventModel[];
}

export enum ViewMode {
  None = "None",
  Create = "Create",
  Join = "Join",
  Game = "Game",
  Score = "Score",
  Chads = "Chads",
  Statistics = "Statistics"
}

export const initialState: FiveHundredState = {
  //eventKey: null,
  //userKey: null,
  event: null,
  hardError: null,
  eventError: null,
  gameError: null,
  //userList: [],
  //currentBid: null,
  //latestChad: null,
  appState: {
    eventKey: null,
    userKey: null,
    appBusy: false,
    userList: [],
    didCreate: false,
    currentBid: null,
    latestChad: null,
    view: ViewMode.None,
    stats: {
      pages: []
    },
    muted: true,
    recentEvents: []
  }
}
