export interface ShipProps {
  ship: Ship;
  onSelection: (ship: Ship) => any;
  selected: boolean;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Ship {
  name: string;
  size: number;
  color: string;
  placed?: boolean;
  zones?: Zone[];
}

export interface GameSummary {
  code: string;
  state: GameState;
  player1: string;
  player2: string;
}

export interface Game {
  code: string;
  state: GameState;
  player1: Player;
  player2: Player;
}

export type GameState = 'creation' | 'progress' | 'player1Win' | 'player2Win';

export interface Player {
  id: PlayerId;
  name: string;
  board: Board;
  hits: Hits;
}

export interface GameHit {
  target: PlayerId;
  coords: Coordinates;
}

export interface GameJoining {
  player: string;
  board: Board;
}

export interface Board {
  ships: Ship[];
}

export interface Hits {
  zones: Zone[];
}

export interface Zone {
  coords: Coordinates;
  touched?: boolean;
}

export type PlayerId = 'player1' | 'player2';

export interface PlayerEvent {
  code: string;
  player: Player;
}

export interface HitEvent {
  code: string;
  player: PlayerId;
  hits: Hits;
}

export interface FinishEvent {
  code: string;
  winner: PlayerId;
}

export type Event = PlayerEvent | HitEvent | FinishEvent;
