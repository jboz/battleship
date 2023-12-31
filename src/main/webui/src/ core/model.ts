export interface Coordinate {
  x: number;
  y: number;
}

export interface Tile {
  coord: Coordinate;
}

export type HomeTile = Tile & {
  hitted?: boolean;
  shipId?: string;
};

export type AttackTile = Tile & {
  hitted?: boolean;
  touched?: boolean;
  destroyedShipdId?: string;
};

export interface Game {
  code: string;
  status: 'CREATION' | 'IN_PROGRESS' | 'FINISHED';
  player1?: string;
  player2?: string;
  nextPlayer?: PlayerId;
}

export enum PlayerId {
  player1 = 'player1',
  player2 = 'player2'
}

export interface Player {
  id: PlayerId;
  name: string;
}

export interface GameJoining {
  gameCode?: string;
  player: string;
  board: {
    tiles: Tile[];
  };
}

export interface Shot {
  target: PlayerId;
  coords: Coordinate;
}

export interface PlayerEvent {
  player: {
    homeBoard: {
      tiles: HomeTile[];
    };
    attackBoard: {
      tiles: AttackTile[];
    };
  };
}

export interface PlayerJoinedEvent {
  joinedPlayerName: string;
}

export interface ShotEvent {
  source: PlayerId;
  nextPlayer: PlayerId;
  shot: Coordinate;
  touched: boolean;
}

export interface FinishedEvent {
  winner: PlayerId;
}
