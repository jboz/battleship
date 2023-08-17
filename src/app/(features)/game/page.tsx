import Grid from "@/app/(core)/components/grid";
import styles from './page.module.css';

export default function Game() {

  return (
    <div className={styles.main}>
      <h1>Game</h1>
      <Grid />
      <Grid />
    </div>
  )
}
  