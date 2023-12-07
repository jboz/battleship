import { HomeBoardTile } from '../../app/components/utils';
import { Ship } from './home.slice';

export const getMatchBoardTiles = (ship: Ship, startBoardTile: HomeBoardTile, tiles: HomeBoardTile[], placementMode: string) =>
  tiles
    .filter(tile => !!!tile.shipId)
    .filter(tile => {
      if (tile.shipId) {
        return true;
      }
      if (placementMode === 'vertical') {
        return (
          tile.coord.x === startBoardTile.coord.x &&
          tile.coord.y >= startBoardTile.coord.y &&
          tile.coord.y < startBoardTile.coord.y + ship.size
        );
      }
      return (
        tile.coord.y === startBoardTile.coord.y &&
        tile.coord.x >= startBoardTile.coord.x &&
        tile.coord.x < startBoardTile.coord.x + ship.size
      );
    });

export const getNextShip = (selectedShip: Ship | undefined, ships: Ship[]) => {
  const actualIndex = (selectedShip && ships.indexOf(selectedShip)) || -1;
  for (let index = Math.max(actualIndex, 0); index < ships.length; index++) {
    const ship = ships[index];
    if (!ship?.placed) {
      return ship;
    }
  }
  if (actualIndex > 0) {
    for (let index = 0; index < ships.length; index++) {
      const ship = ships[index];
      if (!ship.placed) {
        return ship;
      }
    }
  }
  return undefined;
};
