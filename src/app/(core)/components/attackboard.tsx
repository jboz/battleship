import { useEffect, useState } from 'react';
import { Coordinates, Zone } from '../model';
import Board from './board';
import styles from './page.module.css';

interface AttackBoardProps {
  onClick: (coord: Coordinates) => any;
  hits: Zone[];
}

export default function AttackBoard({ onClick, hits }: AttackBoardProps) {
  const dimensions = Array.from({ length: 10 }, (_, i) => i + 1);

  const squareKey = (square: Square) => `${square.coords.x}:${square.coords.y}`;
  const newSquare = (x: number, y: number) => ({ coords: { x, y }, status: 'empty' } as Square);

  const [squares] = useState<Square[]>(dimensions.map(x => dimensions.map(y => newSquare(x, y))).reduce((a, b) => [...a, ...b], []));

  const getCoordinate = (coordinates: Zone[], coord: Coordinates) => coordinates.find(h => h.x === coord.x && h.y === coord.y);

  useEffect(() => {
    squares.forEach(s => {
      const hit = getCoordinate(hits, s.coords);
      if (hit) {
        s.status = hit.touched ? 'touched' : 'targeted';
      }
    });
  }, [hits, squares]);

  return (
    <div className={styles.container}>
      <h1>Attack Board</h1>
      <div className={styles.boardContainer}>
        <Board>
          {squares.map(square => (
            <BoardSquare key={squareKey(square)} square={square} onClick={onClick} />
          ))}
        </Board>
      </div>
    </div>
  );
}

const BoardSquare = ({ square, onClick }: BoardSquareProps) => {
  const [backgroundColor, setBackgroundColor] = useState<string>('#e6e2f1');
  const [status, setStatus] = useState(square.status);

  useEffect(() => {
    square.status = status;
    const color = status === 'touched' ? '#65000b' : status === 'targeted' ? '#828282' : '#e6e2f1';
    setBackgroundColor(color);
  }, [square, status]);

  const toggleStatus = () => {
    if (square.status === 'empty') {
      setStatus('targeted');
    } else if (square.status === 'targeted') {
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
  status: 'empty' | 'targeted' | 'touched';
  coords: Coordinates;
}
