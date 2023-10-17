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
  tiles: Tile[];
}

export interface Hit {
  target: PlayerId;
  coords: Coordinate;
}
