"use client"

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function AttackBoard() {
  const lines = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const columns = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const dimensions = Array.from({ length: 10 }, (_, i) => i + 1);

  const newSquare = (x: number, y: number) => ({ coords: { x, y }, status: 'empty' } as Square)

  const [squares, setSquares] = useState<Square[]>(dimensions.map((x) => dimensions.map((y) => newSquare(x, y))).reduce((a, b) => [...a, ...b], []));

  const headers = (data: string[]) => data.map((value) => (<><div key={value} className={styles.header}>{value}</div></>));

  const squareKey = (square: Square) => `${square.coords.x}:${square.coords.y}`;

  return (
    <div className={styles.container}>
      <h1>Attack Board</h1>
      <div className={styles.boardContainer}>
        <div className={styles.boardContainerX}>
          <div className={styles.boardHeaderX}>{headers(columns)}</div>
          <div className={styles.boardContainerY}>
            <div className={styles.boardHeaderY}>{headers(lines)}</div>
            <div className={styles.board}>
              {squares.map((square) => <BoardSquare key={squareKey(square)} square={square} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BoardSquare = ({ square }: BoardSquareProps) => {

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
  }

  return <div className={styles.cell} style={{ backgroundColor }} onClick={toggleStatus}></div>
}

interface BoardSquareProps {
  square: Square;
}

interface Coordinates {
  x: number;
  y: number;
}

interface Square {
  status: 'empty' | 'targeted' | 'touched';
  coords: Coordinates;
}
