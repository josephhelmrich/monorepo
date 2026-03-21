import { FiveHundredState, initialState } from './five-hundred.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as store from './';


export const fiveHundredFeatureKey = 'fiveHundred';

const selectFiveHundredState = createFeatureSelector<store.FiveHundredState>(fiveHundredFeatureKey);

export const selectAll = createSelector(selectFiveHundredState, (s) => s ?? initialState);
export const selectAppBusy = createSelector(selectFiveHundredState, (s) => s?.appState?.appBusy);
export const selectEvent = createSelector(selectFiveHundredState, (s) => s?.event);
export const selectCurrentGame = createSelector(selectFiveHundredState, (s) => s?.event?.currentGame);
export const selectEventKey = createSelector(selectFiveHundredState, (s) => s?.appState?.eventKey);
export const selectUserKey = createSelector(selectFiveHundredState, (s) => s?.appState?.userKey);
export const selectUsers = createSelector(selectFiveHundredState, (s) => s?.appState.userList);
export const selectAppState = createSelector(selectFiveHundredState, (s) => s?.appState);
//export const selectRecentEvents = createSelector(selectFiveHundredState, (s) => s?.recentEvents);
