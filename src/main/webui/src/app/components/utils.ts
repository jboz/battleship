import { AttackTile, HomeTile, Tile } from '../model';

const DIMENSIONS = Array.from({ length: 10 }, (_, i) => i + 1);

export interface BoardTile {
  color?: string;
  hoverColor?: string;
  cliquable: boolean;
}

export type HomeBoardTile = HomeTile & BoardTile;
export type AttackBoardTile = AttackTile & BoardTile;

export const initTiles = <T extends Tile>() =>
  DIMENSIONS.map(x => DIMENSIONS.map(y => ({ coord: { x, y } } as T))).reduce((a, b) => [...a, ...b], []);

export const clone = <T>(x: T) => JSON.parse(JSON.stringify(x)) as T;
