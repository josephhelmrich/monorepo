export interface EventModel {
}


export interface MongoModel
{
    id: string|null;
}

export interface EventModel extends MongoModel
{
    name: string|null;
    created: Date|null;
    createdByUser: string|null;
    versionNumber: number;
    updated: Date|null;
    currentGame: GameModel|null;
    pastGames: GameModel[];
    users: UserModel[];
    fuckingChads: FuckingChadModel[];
    winningScore: number;
    nilAlone: boolean;
}

export interface RecentEventModel extends MongoModel {
  players: string|null;
  updated: Date|null;
}

export interface FuckingChadModel {
 fromUserId: string;
 toUserId: string;
 from: string;
 to: string;
 chadism: string;
 createDate: string;
}

export interface GameModel extends MongoModel
{
  teams: TeamModel[];
  currentHand: HandModel|null ;
  pastHands: HandModel[];
}

export interface TeamModel extends MongoModel
{
    name: string;
    userIds: string[];
    score: number ;
    //public StatisticsModel Stats { get; set; } = new StatisticsModel();
}

export interface ScoringModel{
  model: TeamModel;
  playerA: string;
  userA: UserModel|null;
  playerB: string;
  userB: UserModel|null;
  score: number;
}


export interface CurrentBidModel extends BidModel {
  player: string;
}

export interface UserModel extends MongoModel
{
    name: string;
    email: string;
    //public StatisticsModel Statistics { get; set; } = new StatisticsModel();
}


export interface StatisticsModel
{
  pages:StatisticsPageModel[];
}

export interface StatisticsPageModel
{
  name: string;
  groups: StatisticGroupModel[];
}

export interface StatisticGroupModel
{
  name: string;
  statistics: StatModel[];
}

export interface StatModel
{
  name: string;
  value: string;
  numericValue: number|null;
}

export interface HandModel extends BidModel
{
    id: string|null;
    bidTeamId: string;
    bidUserId: string;
    actualTricks: number;
    teamAScore: ScoreSnapshotModel|null;
    teamBScore: ScoreSnapshotModel|null;
}

export interface ScoreSnapshotModel
{
    handScore: number;
    gameScore: number;
}

export interface BidModel {
  suit: Suit|null;
  bid: number;
  potentialScore: number;
  userKey: string;
}

export enum Suit {
  spades = "Spades",
  clubs = "Clubs",
  diamonds = "Diamonds",
  hearts = "Hearts",
  noTrump = "NoTrump",
  nil = "Nil"
}


export interface Scoring {
  actualTricks: number|null;
  partnerTricks: number|null;
}

export interface ScoringRequestModel extends Scoring {
  eventId: string
}

export interface AdjustScoreRequest {
  eventId: string;
  handId: string;
  teamAScore: number;
  teamBScore: number;
}
