import { useState } from 'react';
import { BoardSquareProps, Ship, ShipProps, Square } from '../model';
import Board from './board';
import { useHotkeys } from './hotkeys';
import styles from './page.module.css';

interface HomeBoardProps {
  started: boolean;
  ships: Ship[];
  setShips: (ships: Ship[]) => any;
}

export default function HomeBoard({ started, ships, setShips }: HomeBoardProps) {
  const dimensions = Array.from({ length: 10 }, (_, i) => i + 1);

  const [placementMode, setPlacementMode] = useState<'vertical' | 'horizontal'>('horizontal');
  const [squares, setSquares] = useState<Square[]>(
    dimensions.map(x => dimensions.map(y => newSquare(x, y))).reduce((a, b) => [...a, ...b], [])
  );
  const [selectedShip, setSelectedShip] = useState<Ship | undefined>(undefined);

  const squareOnClick = (clickedSquare: Square) => {
    if (started) {
      clickedSquare.isHit = !clickedSquare.isHit;
      setSquares([...squares]);
      return;
    }
    if (clickedSquare.ship) {
      // remove ship from the board and select it
      clickedSquare.ship.placed = false;
      setShips([...ships]);
      setSelectedShip(clickedSquare.ship);
      squares.filter(square => square.ship?.id === clickedSquare.ship?.id).forEach(square => (square.ship = undefined));
      setSquares([...squares]);
    } else if (selectedShip) {
      // place the ship if possible
      const matchSquares = getMatchSquares(selectedShip, clickedSquare);
      if (matchSquares.length < selectedShip.size) {
        return;
      }
      selectedShip.placed = true;
      setShips([...ships]);

      matchSquares.forEach(square => (square.ship = selectedShip));
      setSquares([...squares]);

      setSelectedShip(getNextShip());
    }
  };

  const onMouseEnter = (square: Square) => {
    if (selectedShip && !square.ship) {
      const matchSquares = getMatchSquares(selectedShip, square);
      if (matchSquares.length !== selectedShip.size) {
        return;
      }
      matchSquares.forEach(square => (square.hoverColor = selectedShip.color + '55'));
      setSquares([...squares]);
    }
  };

  const onMouseOut = (square: Square) => {
    squares.forEach(square => (square.hoverColor = undefined));
    setSquares([...squares]);
  };

  const getMatchSquares = (ship: Ship, startSquare: Square) =>
    squares
      .filter(square => !!!square.ship)
      .filter(square => {
        if (placementMode === 'horizontal') {
          return (
            square.coords.x === startSquare.coords.x &&
            square.coords.y >= startSquare.coords.y &&
            square.coords.y < startSquare.coords.y + ship.size
          );
        }
        return (
          square.coords.y === startSquare.coords.y &&
          square.coords.x >= startSquare.coords.x &&
          square.coords.x < startSquare.coords.x + ship.size
        );
      });

  const togglePlacementMode = () => setPlacementMode(placementMode === 'horizontal' ? 'vertical' : 'horizontal');

  useHotkeys('v', () => togglePlacementMode());
  useHotkeys('h', () => togglePlacementMode());

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
    setShips(ships.map(s => ({ ...s, placed: false })));
    setSquares(squares.map(s => ({ ...s, ship: undefined })));
  };

  return (
    <div className={styles.container}>
      {started && <h1>Home Board</h1>}
      {!started && (
        <div className={styles.toolbar}>
          <div>
            <button onClick={() => togglePlacementMode()}>Toggle mode</button>
            {placementMode}
          </div>
          <button onClick={() => reset()}>Reset</button>
        </div>
      )}
      <div className={styles.boardContainer}>
        <Board>
          {squares.map(square => (
            <BoardSquare
              key={squareKey(square)}
              square={square}
              onClick={squareOnClick}
              onMouseEnter={onMouseEnter}
              onMouseOut={onMouseOut}
            />
          ))}
        </Board>

        {!started && (
          <div className={styles.ships}>
            {ships
              .filter(s => !s.placed)
              .map((ship, index) => (
                <BoardShip key={'ship' + index} ship={ship} onSelection={setSelectedShip} selected={selectedShip?.id === ship.id} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

const BoardSquare = ({ square, onClick, onMouseEnter, onMouseOut }: BoardSquareProps) => {
  return (
    <div
      className={styles.cell}
      style={{ backgroundColor: square.ship && square.isHit ? '#65000b' : square.ship?.color || square.hoverColor || '#e6e2f1' }}
      onClick={() => onClick(square)}
      onMouseEnter={() => onMouseEnter(square)}
      onMouseOut={() => onMouseOut(square)}
    ></div>
  );
};

const BoardShip = ({ ship, onSelection, selected }: ShipProps) => {
  return (
    <div className={styles.ship} onClick={() => !ship.placed && onSelection(ship)}>
      {Array.from({ length: ship.size }).map((_, index) => (
        <div
          key={ship.name + index}
          className={styles.cell}
          style={{ backgroundColor: !ship.placed ? ship.color : '#84808b', borderColor: selected ? '#e6e2f1' : '#272138' }}
        ></div>
      ))}
    </div>
  );
};

const newSquare = (x: number, y: number) => ({ coords: { x, y }, hasShip: false, isHit: false } as Square);
const squareKey = (square: Square) => `${square.coords.x}:${square.coords.y}`;
