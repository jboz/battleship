'use client';

import { useEffect, useState } from 'react';
import { Coordinates, Hits } from '../model';
import BoardComponent from './board';
import styles from './page.module.css';

interface AttackBoardProps {
  onClick: (coord: Coordinates) => any;
  hits: Hits;
}

export default function AttackBoard({ onClick, hits }: AttackBoardProps) {
  const dimensions = Array.from({ length: 10 }, (_, i) => i + 1);

  const squareKey = (square: Square) => `${square.coords.x}:${square.coords.y}`;
  const newSquare = (x: number, y: number) => ({ coords: { x, y }, status: 'empty' } as Square);

  const [squares, setSquares] = useState<Square[]>(
    dimensions.map(x => dimensions.map(y => newSquare(x, y))).reduce((a, b) => [...a, ...b], [])
  );

  useEffect(() => {
    hits.zones.forEach(hit => {
      const square = squares.find(s => s.coords.x === hit.coords.x && s.coords.y === hit.coords.y);
      if (square) {
        square.status = !!hit.touched ? 'touched' : 'hitted';
      }
    });
    setSquares([...squares]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hits]);

  return (
    <div className={styles.container}>
      <h1>Attack Board</h1>
      <div className={styles.boardContainer}>
        <BoardComponent>
          {squares.map(square => (
            <BoardSquare key={squareKey(square)} square={square} onClick={onClick} />
          ))}
        </BoardComponent>
      </div>
    </div>
  );
}

const BoardSquare = ({ square, onClick }: BoardSquareProps) => {
  const [backgroundColor, setBackgroundColor] = useState<string>('#e6e2f1');
  const [status, setStatus] = useState(square.status);

  useEffect(() => {
    setStatus(square.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [square.status]);

  useEffect(() => {
    square.status = status;
    const color = status === 'touched' ? '#65000b' : status === 'hitted' ? '#828282' : '#e6e2f1';
    setBackgroundColor(color);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const toggleStatus = () => {
    if (square.status === 'empty') {
      setStatus('hitted');
    } else if (square.status === 'hitted') {
      setStatus('touched');
    } else if (square.status === 'touched') {
      setStatus('empty');
    }
    onClick(square.coords);
  };

  return <div className={styles.cell} style={{ backgroundColor }} onClick={toggleStatus}></div>;
};

interface BoardSquareProps {
  square: Square;
  onClick: (coord: Coordinates) => any;
}

interface Square {
  status: 'empty' | 'hitted' | 'touched';
  coords: Coordinates;
}
