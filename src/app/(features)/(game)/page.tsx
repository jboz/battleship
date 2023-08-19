"use client"

import AttackBoard from "@/app/(core)/components/attackboard";
import HomeBoard from "@/app/(core)/components/homeboard";
import { Ship } from "@/app/(core)/model";
import { useState } from "react";
import styles from './page.module.css';

export default function Game() {
  const [started, setStarted] = useState<boolean>(false);
  
  const [ships, setShips] = useState<Ship[]>([
    { id: 1, name: 'Carrier', size: 5, color: '#be456e' },
    { id: 2, name: 'Battleship', size: 4, color: '#0494ff' },
    { id: 3, name: 'Cruiser', size: 3, color: '#04ff8a' },
    { id: 4, name: 'Cruiser', size: 3, color: '#04ff8a' },
    { id: 5, name: 'Submarine', size: 3, color: '#04ffde' },
    { id: 6, name: 'Submarine', size: 3, color: '#04ffde' },
    { id: 7, name: 'Destroyer', size: 2, color: '#af54a0' },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <HomeBoard started={started} ships={ships} setShips={setShips} />
        {!started && ships.filter(s => !s.placed).length === 0 && (<button onClick={() => setStarted(true)}>Start game</button>)}
      </div>
      <div className={styles.board}>
        {started && (<AttackBoard />)}
        {started && (<button onClick={() => setStarted(false)}>Restart game</button>)}
      </div>
    </div>
  )
}
  