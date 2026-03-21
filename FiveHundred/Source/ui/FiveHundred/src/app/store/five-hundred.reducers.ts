import { EventModel, StatisticsModel } from './../models/event.model';
import { hardErrorAction } from './five-hundred.actions';
import { ActionReducerMap } from "@ngrx/store";
import * as appStore from './';
import * as models from '../models';
import { ViewMode } from './five-hundred.state';

function appReducer(state = appStore.initialState, action: any): appStore.FiveHundredState {
  switch (action.type) {
    // global actions
     case appStore.resetAppAction.type:
       return reset(appStore.initialState);
    case appStore.hardErrorAction.type:
      return hardError(state, action);
    case appStore.setViewAction.type:
      return setView(state, action.view);
    case appStore.createEventAction.type:
      return setAppBusy(state, true);
    case appStore.enterEventAction.type:
      return eventCreated(state, action.response, action.didCreate);
    case appStore.updateEventKeyAction.type:
      return updateEventKey(state, action.eventKey);
    case appStore.loadUsersAction.type:
      return updateUsers(state, action.users);
    case appStore.updateUserKeyAction.type:
      return updateUserKey(state, action.eventKey, action.userKey);
    case appStore.bidSavedAction.type:
    case appStore.gameStartedAction.type:
    case appStore.scoreSavedAction.type:
    case appStore.eventRefreshedAction.type:
      return refreshEvent(state, action.response);
    case appStore.getStatisticsAction.type:
      return setAppBusy(state, true);
    case appStore.getStatisticsSuccessAction.type:
      return updateStatistics(state, action.stats);
    case appStore.updateSettingsAction.type:
      return setSettings(state, action.muted);
    case appStore.loadSettingsAction.type:
      return loadUsersSettings(state);
    case appStore.startLoadRecentAction.type:
      return setAppBusy(state, true);
    case appStore.recentLoadedAction.type:
      return setRecentEvents(state, action.events);
    default:
      return state;
  }
}

export interface FiveHundredReducers {
  app: appStore.FiveHundredState;
}

export const reducers: ActionReducerMap<FiveHundredReducers> = {
  app: appReducer
};

function setView(state: appStore.FiveHundredState, view: ViewMode): appStore.FiveHundredState {
  const stateCopy = {...state};
  stateCopy.appState = {... state.appState} ;
  stateCopy.appState.view = view;
  return stateCopy;
}

function updateEventKey(state: appStore.FiveHundredState, eventKey: string): appStore.FiveHundredState {
  const stateCopy = {...state};
  setEventKey(stateCopy, eventKey);
  return stateCopy;
}

function updateUserKey(state: appStore.FiveHundredState, eventKey: string, userKey: string): appStore.FiveHundredState {
  const stateCopy = {...state};
  stateCopy.appState = {... state.appState} ;
  stateCopy.appState.userKey = userKey;
  setEventKey(stateCopy, eventKey);
  return stateCopy;
}

function setEventKey(stateCopy: appStore.FiveHundredState, eventKey: string): appStore.FiveHundredState {
  stateCopy.appState = {... stateCopy.appState} ;
  stateCopy.appState.eventKey = eventKey;
  if (stateCopy.event && stateCopy.event.id != eventKey)
    stateCopy.event = null;
  return stateCopy;
}

function updateUsers(state: appStore.FiveHundredState, users: models.UserModel[]): appStore.FiveHundredState {
  const stateCopy = {...state};
  stateCopy.appState = {...state.appState};
  stateCopy.appState.userList = users;
  return stateCopy;
}

function reset(state: appStore.FiveHundredState): appStore.FiveHundredState {
  const stateCopy = { ...state };
  stateCopy.appState = {...state.appState};
  updateAppBusy(stateCopy, false);
  return stateCopy;
}

function hardError(state: appStore.FiveHundredState, action: any): appStore.FiveHundredState {
  const stateCopy = {...state};
  stateCopy.appState = {...state.appState};
  stateCopy.appState.view = ViewMode.Create;
  updateAppBusy(stateCopy, false);
  stateCopy.hardError =
  {
    error: action.error,
    userMessage: action.userMessage
  };

  console.error(stateCopy.hardError);
  return stateCopy;
}

// function gameError(state: appStore.FiveHundredState, action: any): appStore.FiveHundredState {
//   const stateCopy = {...state};
//   updateAppBusy(stateCopy, false);
//   stateCopy.gameError =
//   {
//     error: action.error,
//     userMessage: action.userMessage
//   };
//   return stateCopy;
// }

// function eventError(state: appStore.FiveHundredState, action: any): appStore.FiveHundredState {
//   const stateCopy = {...state};
//   updateAppBusy(stateCopy, false);
//   stateCopy.eventError =
//   {
//     error: action.error,
//     userMessage: action.userMessage
//   };
//   return stateCopy;
// }

function setAppBusy(state: appStore.FiveHundredState, busy: boolean): appStore.FiveHundredState {
  const stateCopy = { ...state };
  stateCopy.appState = {...state.appState};
  updateAppBusy(stateCopy, busy);
  return stateCopy;
}

function updateAppBusy(stateCopy: appStore.FiveHundredState, busy: boolean) {
  stateCopy.appState.appBusy = busy;
}

function eventCreated(state: appStore.FiveHundredState, response: models.EventModel, didCreate: boolean): appStore.FiveHundredState {
  const stateCopy = { ...state };
  stateCopy.appState = {... state.appState} ;
  updateEvent(stateCopy, response);
  stateCopy.appState.eventKey = response.id;
  if (didCreate) {
    stateCopy.appState.userKey = response.createdByUser;
  }
  stateCopy.appState.didCreate = didCreate;
  updateAppBusy(stateCopy, false);
  return stateCopy;
}

function refreshEvent(state: appStore.FiveHundredState, event: models.EventModel) {
  const stateCopy = { ...state };
  stateCopy.appState = {... state.appState} ;
  updateEvent(stateCopy, event);
  updateAppBusy(stateCopy, false);
  return stateCopy;
}



function updateStatistics(state: appStore.FiveHundredState, stats: models.StatisticsModel) {
  const stateCopy = { ...state };
  stateCopy.appState = {... state.appState} ;
  stateCopy.appState.stats = stats;
  updateAppBusy(stateCopy, false);
  return stateCopy;
}

function updateEvent(state: appStore.FiveHundredState, event: models.EventModel): void {

  var currentCount = state.event?.fuckingChads?.length ?? 0;
  var latestCount = event.fuckingChads?.length ?? 0;

  state.event = event;
  state.appState.currentBid = <models.BidModel> event?.currentGame?.currentHand;

  if (latestCount > currentCount) {
    state.appState.latestChad = state.event?.fuckingChads[0];
  }
  else {
    state.appState.latestChad = null;
  }
}

function setSettings(state: appStore.FiveHundredState, muted: boolean): appStore.FiveHundredState {
  const stateCopy = { ...state };
  stateCopy.appState = {...state.appState};
  stateCopy.appState.muted = muted;
  var setting = muted.toString();
  localStorage.setItem(muted_setting, setting);

  console.info(`Saved settings to localStorage: {muted: ${stateCopy.appState.muted}}`);

  return stateCopy;
}

function loadUsersSettings(state: appStore.FiveHundredState): appStore.FiveHundredState {
  const stateCopy = { ...state };
  stateCopy.appState = {...state.appState};

  var setting = localStorage.getItem(muted_setting);
  if (setting != null) {
    var b = setting === "true";
    stateCopy.appState.muted = b;
    console.info(`Loaded settings from localStorage: {muted: ${stateCopy.appState.muted}}`);
  }

  return stateCopy;
}


function setRecentEvents(state: appStore.FiveHundredState, recent: models.RecentEventModel[]): appStore.FiveHundredState {
  const stateCopy = { ...state };
  stateCopy.appState = {...state.appState};
  stateCopy.appState.recentEvents = recent;
  updateAppBusy(stateCopy, false);
  return stateCopy;
}


const muted_setting: string = "muted";
