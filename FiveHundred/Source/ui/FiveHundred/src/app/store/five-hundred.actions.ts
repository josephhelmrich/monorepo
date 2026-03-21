import { UserModel, StatisticsModel } from './../models/event.model';
import * as models from './../models/';
import { createAction, props } from '@ngrx/store';
import * as store from './';
import { ViewMode } from './five-hundred.state';

// shared, application level actions
export const resetAppAction = createAction('[App] Reset');
export const hardErrorAction = createAction('[App] Hard Error', props<{ error: any, userMessage: string }>());
export const noActionNeededAction = createAction('[App] No Action Required');
export const setViewAction = createAction('[App] Set View', props<{ view: ViewMode }>());


// create/join event
export const loadSettingsAction = createAction('[App] Load Settings');
export const createEventAction = createAction('[App] Create Event', props<{ request: models.CreateRequestModel }>());
export const enterEventAction = createAction('[App] Enter Event Success', props<{ response: models.EventModel, didCreate: boolean }>());
export const enteredEventAction = createAction('[App] Create Event Success', props<{ eventKey: string }>());
export const loadUsersAction = createAction('[App] Load Users', props<{ users: UserModel[] }>());

export const startLoadRecentAction = createAction('[App] Load Recent');
export const recentLoadedAction = createAction('[App] Loaded Recent', props<{ events: models.RecentEventModel[] }>());

export const updateEventKeyAction = createAction('[App] Update Event Key', props<{ eventKey: string }>());
export const updateUserKeyAction = createAction('[App] Update User Key', props<{ eventKey: string, userKey: string }>());

export const enterBidAction = createAction('[App] Enter Bid', props<{ bid: models.BidModel }>());
export const bidSavedAction = createAction('[App] Bid Saved', props<{ response: models.EventModel }>());

export const startGameAction = createAction('[App] Start Game', props<{ teams: models.TeamModel[] }>());
export const gameStartedAction = createAction('[App] Game Started', props<{ response: models.EventModel }>());

export const enterScoreAction = createAction('[App] Enter Score', props<{ score: models.ScoringRequestModel }>());
export const scoreSavedAction = createAction('[App] Score Saved', props<{ response: models.EventModel }>());

export const refreshEventAction = createAction('[App] Refresh Event');
export const eventRefreshedAction = createAction('[App] Event Refreshed', props<{ response: models.EventModel }>());

export const adjustScoreAction = createAction('[App] Score Adjusted', props<{ request: models.AdjustScoreRequest }>());
export const updateSettingsAction = createAction('[App] Update Settings', props<{ score: Number, muted: boolean, nilAlone: boolean }>());

export const sendChadAction = createAction('[App] Send Chad', props<{ recipientId: string }>());


export const getStatisticsAction = createAction('[App] Get Statistics', props<{ gameId: string|null }>());
export const getStatisticsSuccessAction = createAction('[App] Get Statistics Success', props<{ stats: StatisticsModel }>());

export const forceRefreshAction = createAction('[App] Force Refresh');
