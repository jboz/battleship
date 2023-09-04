export interface ShipProps {
  ship: Ship;
  onSelection: (ship: Ship) => any;
  selected: boolean;
}

export interface BoardSquareProps {
  square: Square;
  onClick: (square: Square) => any;
  onMouseEnter: (square: Square) => any;
  onMouseOut: (square: Square) => any;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Square {
  ship?: Ship;
  hoverColor?: string;
  isHit: boolean;
  coords: Coordinates;
}

export interface Ship {
  id: number;
  name: string;
  size: number;
  color: string;
  placed?: boolean;
}

export interface Game {
  id: string;
  player1: Player;
  player2: Player;
}

export interface Player {
  name: string;
  hits?: Coordinates[];
}

export interface GameCreation {
  player: string;
}

export interface GameHit {
  target: PlayerId;
  coords: Coordinates;
}

export interface GameJoining {
  player: string;
}

export type PlayerId = 'player1' | 'player2';

export interface BusPayload {
  gameId: string;
  player: PlayerId;
  finished?: boolean;
  message: any;
}
