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
};

export interface Game {
  code: string;
  status: 'CREATION' | 'IN_PROGRESS' | 'FINISHED';
  player1?: string;
  player2?: string;
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

export interface Hit {
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

export interface FinishedEvent {
  winner: PlayerId;
}
