import styles from './page.module.css';

export default function BoardComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.boardContainerX}>
      <div className={styles.boardHeaderX}>
        <div className={styles.header}></div>
        <div className={styles.header}>A</div>
        <div className={styles.header}>B</div>
        <div className={styles.header}>C</div>
        <div className={styles.header}>D</div>
        <div className={styles.header}>E</div>
        <div className={styles.header}>F</div>
        <div className={styles.header}>G</div>
        <div className={styles.header}>H</div>
        <div className={styles.header}>I</div>
        <div className={styles.header}>J</div>
      </div>
      <div className={styles.boardContainerY}>
        <div className={styles.boardHeaderY}>
          <div className={styles.header}>1</div>
          <div className={styles.header}>2</div>
          <div className={styles.header}>3</div>
          <div className={styles.header}>4</div>
          <div className={styles.header}>5</div>
          <div className={styles.header}>6</div>
          <div className={styles.header}>7</div>
          <div className={styles.header}>8</div>
          <div className={styles.header}>9</div>
          <div className={styles.header}>10</div>
        </div>
        <div className={styles.board}>{children}</div>
      </div>
    </div>
  );
}
