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
  id: number;
  name: string;
  size: number;
  color: string;
  placed?: boolean;
  coords: Coordinates[];
}

export interface GameSumary {
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
  board: Coordinates[];
  hits: Zone[];
}

export type Zone = Coordinates & { touched?: boolean };

export interface GameHit {
  target: PlayerId;
  coords: Coordinates;
}

export interface GameJoining {
  player: string;
  board: Coordinates[];
}

export type PlayerId = 'player1' | 'player2';

export interface OnConnectEvent {
  board: Zone[];
}

export interface OnStateChangeEvent {
  state: GameState;
}

export type Event = OnConnectEvent | OnStateChangeEvent;

export interface EventPayload {
  type: EventType;
  content: Event;
}

export type EventType = 'onBoardChange' | 'onStateChange';
