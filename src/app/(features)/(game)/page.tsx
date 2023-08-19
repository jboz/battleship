"use client"

import AttackBoard from "@/app/(core)/components/attackboard";
import HomeBoard from "@/app/(core)/components/homeboard";
import { useState } from "react";
import styles from './page.module.css';

export default function Game() {

  const [started, setStarted] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <HomeBoard started={started} />
        {!started && (<button onClick={() => setStarted(true)}>Start game</button>)}
      </div>
      <div className={styles.board}>
        {started && (<AttackBoard />)}
        {started && (<button onClick={() => setStarted(false)}>Restart game</button>)}
      </div>
    </div>
  )
}
  