import { AttackTile, Coordinate, HomeTile, Tile } from '../model';

const DIMENSIONS = Array.from({ length: 10 }, (_, i) => i + 1);

export interface BoardTile {
  color?: string;
  hoverColor?: string;
  cliquable: boolean;
}

export type HomeBoardTile = HomeTile & BoardTile;
export type AttackBoardTile = AttackTile & BoardTile;

export const initTiles = <T extends Tile>() =>
  DIMENSIONS.map(y => DIMENSIONS.map(x => ({ coord: { x, y } } as T))).reduce((a, b) => [...a, ...b], []);

const X = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const coordToString = (coord: Coordinate) => X[coord.x] + '' + coord.y;
