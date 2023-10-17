import { useState } from 'react';
import { BoardComponent } from '../../app/components/board';
import { HomeBoardTile } from '../../app/components/utils';
import { Coordinate } from '../../app/model';
import { useAppSelector } from '../../app/store/hooks';
import { useHotkeys } from '../../app/use-hotkeys';
import './home-board.scss';
import { selectHomeTiles } from './home.slice';

interface Ship {
  id: string;
  size: number;
  color: string;
  placed?: boolean;
  coords: Coordinate[];
}

export const HomeBoard = () => {
  const [ships, setShips] = useState<Ship[]>([
    { id: 'Carrier', size: 5, color: '#be456e', coords: [] },
    { id: 'Battleship', size: 4, color: '#0494ff', coords: [] },
    { id: 'Cruiser1', size: 3, color: '#04ff8a', coords: [] },
    { id: 'Cruiser2', size: 3, color: '#04ff8a', coords: [] },
    { id: 'Submarine1', size: 3, color: '#04ffde', coords: [] },
    { id: 'Submarine2', size: 3, color: '#04ffde', coords: [] },
    { id: 'Destroyer', size: 2, color: '#af54a0', coords: [] }
  ]);

  const [placementMode, setPlacementMode] = useState<'vertical' | 'horizontal'>('horizontal');
  const [selectedShip, setSelectedShip] = useState<Ship | undefined>(undefined);

  const [tiles, setTiles] = useState<HomeBoardTile[]>(useAppSelector(selectHomeTiles));

  const shipById = (id?: string) => ships.find(ship => ship.id === id);

  const onTileMouseEnter = (hoverTile: HomeBoardTile) => {
    if (selectedShip && !hoverTile.shipId) {
      const matchTiles = getMatchBoardTiles(selectedShip, hoverTile);
      if (matchTiles.length !== selectedShip.size) {
        return;
      }
      matchTiles.forEach(tile => (tile.hoverColor = selectedShip.color + '55'));
      setTiles([...tiles]);
    }
  };

  const onTileMouseOut = () => {
    tiles.forEach(tile => (tile.hoverColor = undefined));
    setTiles([...tiles]);
  };

  const onTileClick = (cliquedTile: HomeBoardTile) => {
    const ship = shipById(cliquedTile.shipId);
    if (ship) {
      reselectShip(cliquedTile, ship);
    } else if (selectedShip) {
      tryToPlaceShip(cliquedTile, selectedShip);
    }
  };

  const reselectShip = (cliquedTile: HomeBoardTile, ship: Ship) => {
    ship.placed = false;
    ship.coords = [];
    setShips([...ships]);
    setSelectedShip(ship);
    tiles
      .filter(tile => tile.shipId === cliquedTile.shipId)
      .forEach(tile => {
        tile.shipId = undefined;
        tile.color = undefined;
        tile.hoverColor = ship.color + '55';
      });
    setTiles([...tiles]);
  };

  const tryToPlaceShip = (cliquedTile: HomeBoardTile, selectedShip: Ship) => {
    const matchTiles = getMatchBoardTiles(selectedShip, cliquedTile);
    if (matchTiles.length < selectedShip.size) {
      return;
    }
    selectedShip.placed = true;
    selectedShip.coords = [...matchTiles.map(s => s.coord)];
    setShips([...ships]);

    matchTiles.forEach(tile => {
      tile.shipId = selectedShip.id;
      tile.color = selectedShip.color;
      tile.hoverColor = undefined;
    });
    setTiles([...tiles]);

    setSelectedShip(getNextShip());
  };

  const getMatchBoardTiles = (ship: Ship, startBoardTile: HomeBoardTile) =>
    tiles
      .filter(tile => !!!tile.shipId)
      .filter(tile => {
        if (tile.shipId) {
          return true;
        }
        if (placementMode === 'horizontal') {
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

  const getNextShip = () => {
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

  const reset = () => {
    setShips(ships.map(s => ({ ...s, placed: false, zones: [] })));
    tiles.forEach(tile => {
      tile.shipId = undefined;
      tile.color = undefined;
      tile.hoverColor = undefined;
    });
    setTiles(tiles);
  };

  const togglePlacementMode = () => setPlacementMode(placementMode === 'horizontal' ? 'vertical' : 'horizontal');

  useHotkeys('v', () => togglePlacementMode());
  useHotkeys('h', () => togglePlacementMode());

  return (
    <div className="container">
      <h1>Home Board</h1>

      <div className="toolbar">
        <div>
          <button onClick={() => togglePlacementMode()}>Toggle mode</button>
          {placementMode}
        </div>
        <button onClick={() => reset()}>Reset</button>
      </div>
      <div className="boardContainer">
        <BoardComponent tiles={tiles} onClick={onTileClick} onMouseEnter={onTileMouseEnter} onMouseOut={onTileMouseOut} />
        <div className="ships">
          {ships
            .filter(s => !s.placed)
            .map((ship, index) => (
              <div key={index} className="ship" onClick={() => !ship.placed && setSelectedShip(ship)}>
                {Array.from({ length: ship.size }).map((_, index) => (
                  <div
                    key={ship.id + index}
                    className="cell"
                    style={{
                      backgroundColor: !ship.placed ? ship.color : '#84808b',
                      borderColor: selectedShip?.id === ship.id ? '#e6e2f1' : '#272138'
                    }}
                  ></div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
