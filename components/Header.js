import Link from 'next/link';
import Navigation from './Navigation';
import styles from '@/styles/Header.module.css';

export default function Header({ activeNav }) {
  return (
    <header className={styles.header}>
      <div className={styles.nameContainer}>
        <Link href="/" className={styles.name}>
          Ethan MacCumber
        </Link>
      </div>
      <Navigation activeNav={activeNav} />
    </header>
  );
}
