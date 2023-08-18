import Board from "@/app/(core)/components/board";
import styles from './page.module.css';

export default function Game() {

  return (
    <div className={styles.main}>
      <h1>New game</h1>
      <Board />
    </div>
  )
}
  