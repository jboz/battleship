"use client"

import { useState } from 'react';
import styles from './page.module.css';

interface HomeBoardProps {
  started: boolean;
}

export default function HomeBoard({started}: HomeBoardProps) {
  const lines = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const columns = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const dimensions = Array.from({ length: 10 }, (_, i) => i + 1);

  const [placementMode, setPlacementMode] = useState<'vertical' | 'horizontal'>('horizontal');

  const [ships, setShips] = useState<Ship[]>([
    { id: 1, name: 'Carrier', size: 5, color: '#be456e' },
    { id: 2, name: 'Battleship', size: 4, color: '#0494ff' },
    // { id: 3, name: 'Battleship', size: 4, color: '#0494ff' },
    { id: 4, name: 'Cruiser', size: 3, color: '#04ff8a' },
    // { id: 5, name: 'Cruiser', size: 3, color: '#04ff8a' },
    { id: 6, name: 'Submarine', size: 3, color: '#04ffde' },
    // { id: 7, name: 'Submarine', size: 3, color: '#04ffde' },
    { id: 8, name: 'Destroyer', size: 2, color: '#af54a0' },
  ]);

  const newSquare = (x: number, y: number) => ({ coords: { x, y }, hasShip: false, isHit: false } as Square)

  const [squares, setSquares] = useState<Square[]>(dimensions.map((x) => dimensions.map((y) => newSquare(x, y))).reduce((a, b) => [...a, ...b], []));

  const headers = (data: string[]) => data.map((value) => (<><div key={value} className={styles.header}>{value}</div></>));

  const squareKey = (square: Square) => `${square.coords.x}:${square.coords.y}`;

  const [selectedShip, setSelectedShip] = useState<Ship | undefined>(undefined);

  const squareOnClick = (clickedSquare: Square) => {
    if (clickedSquare.ship) {
      // remove ship from the board and select it
      clickedSquare.ship.placed = false;
      setShips([...ships]);
      setSelectedShip(clickedSquare.ship);
      squares.filter(square => square.ship?.id === clickedSquare.ship?.id).forEach(square => square.ship = undefined);
      setSquares([...squares]);
      togglePlacementMode();

    } else if (selectedShip) {
      // place the ship if possible
      const matchSquares = getMatchSquares(selectedShip, clickedSquare);
      if (matchSquares.length < selectedShip.size) {
        return;
      }
      selectedShip.placed = true;
      setShips([...ships]);

      matchSquares.forEach(square => square.ship = selectedShip);
      setSquares([...squares]);

      setSelectedShip(getNextShip());
    }
  }

  const onMouseEnter = (square: Square) => {
    if (selectedShip && !square.ship) {
      const matchSquares = getMatchSquares(selectedShip, square);
      if (matchSquares.length !== selectedShip.size) {
        return;
      }
      matchSquares.forEach(square => square.hoverColor = selectedShip.color + '55');
      setSquares([...squares]);
    }
  }

  const onMouseOut = (square: Square) => {
    squares.forEach(square => square.hoverColor = undefined);
    setSquares([...squares]);
  }

  const getMatchSquares = (ship: Ship, startSquare: Square) => squares
    .filter(square => !!!square.ship)
    .filter(square => {
      if (placementMode === 'horizontal') {
        return square.coords.x === startSquare.coords.x && square.coords.y >= startSquare.coords.y && square.coords.y < (startSquare.coords.y + ship.size);      } 
      return square.coords.y === startSquare.coords.y && square.coords.x >= startSquare.coords.x && square.coords.x < (startSquare.coords.x + ship.size);
    });

  const togglePlacementMode = () => setPlacementMode(placementMode === 'horizontal' ? 'vertical' : 'horizontal');

  const getNextShip = () => {
    const actualIndex = selectedShip && ships.indexOf(selectedShip) || -1;
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
  }

  const reset = () => {
    setShips(ships.map(s => ({...s, placed: false})))
    setSquares(squares.map(s => ({...s, ship: undefined})));
  }

  return (
    <div className={styles.container}>
      {started && (<h1>Home Board</h1>)}
      {!started && (<div className={styles.toolbar}>
        <div>
          <button onClick={() => togglePlacementMode()}>Toggle mode</button>
          {placementMode}
        </div>
        <button onClick={() => reset()}>Reset</button>
      </div>)}
      <div className={styles.boardContainer}>
        <div className={styles.boardContainerX}>
          <div className={styles.boardHeaderX}>{headers(columns)}</div>
          <div className={styles.boardContainerY}>
            <div className={styles.boardHeaderY}>{headers(lines)}</div>
            <div className={styles.board}>
              {squares.map((square) => <BoardSquare key={squareKey(square)} square={square} onClick={squareOnClick} onMouseEnter={onMouseEnter} onMouseOut={onMouseOut} />)}
            </div>
          </div>
        </div>

        {!started && (<div className={styles.ships}>
          {ships.map((ship, index) => <ShipComponent key={'ship' + index} ship={ship} selectable={!ship.placed} onSelection={setSelectedShip} selected={selectedShip?.id === ship.id} />)}
        </div>)}
      </div>
    </div>
  )
}

const BoardSquare = ({ square, onClick, onMouseEnter, onMouseOut }: BoardSquareProps) => {

  return <div className={styles.cell} style={{ backgroundColor: square.ship?.color || square.hoverColor || '#e6e2f1' }} onClick={() => onClick(square)} onMouseEnter={() => onMouseEnter(square)} onMouseOut={() => onMouseOut(square)}></div>
}

const ShipComponent = ({ ship, onSelection, selected }: ShipProps) => {

  return <div className={styles.ship} onClick={() => !ship.placed && onSelection(ship)}>
    {Array.from({ length: ship.size }).map((_, index) => (<div key={ship.name + index} className={styles.cell} style={{ backgroundColor: !ship.placed ? ship.color : '#84808b', borderColor: selected ? '#e6e2f1' : '#272138' }}></div>))}
  </div>
}

interface ShipProps {
  ship: Ship;
  selectable: boolean;
  onSelection: (ship: Ship) => any;
  selected: boolean;
}

interface BoardSquareProps {
  square: Square;
  onClick: (square: Square) => any;
  onMouseEnter: (square: Square) => any;
  onMouseOut: (square: Square) => any;
}

interface Coordinates {
  x: number;
  y: number;
}

interface Square {
  ship?: Ship;
  hoverColor?: string;
  isHit: boolean;
  coords: Coordinates;
}

interface Ship {
  id: number;
  name: string;
  size: number;
  color: string;
  placed?: boolean;
}
