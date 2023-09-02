import Link from 'next/link';
import styles from './navbar.module.css';

export default function NavBar() {
  return (
    <ul className={styles.ul}>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/game">New Game</Link>
      </li>
      <li>
        <Link href="/user/login">Login</Link>
      </li>
      <li>
        <Link href="/user/signup">Sign Up</Link>
      </li>
    </ul>
  );
}
