"use client"

import styles from './page.module.css';

export default function Grid() {

  const lines = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const columns = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const empties = ['', '', '', '', '', '', '', '', '', ''];

  const boxes = (data: string[], nested: boolean = false) => data.map((data, index) => (<><div key={index}>{data}</div><>{nested && cells(index+1)}</></>));
  const cells = (y: number) => empties.map((data, index) => (<Cell key={index} coords={{x:index+1, y}} />));

  return (
    <div className={styles.grid}>
      <div />
      {boxes(columns)}
      {boxes(lines, true)}
    </div>
  )
}

const Cell = ({coords}: BoxProps) => {

  const click = () => console.log(`coords`, coords);

  return <div className={styles.cell} onClick={() => click()}></div>
}

interface BoxProps {
  coords: Coordinates;
}

interface Coordinates {
  x: number;
  y: number;
}
