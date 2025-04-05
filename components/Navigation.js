import Link from 'next/link';
import styles from '@/styles/Navigation.module.css';

export default function Navigation({ activeNav }) {
  const navItems = [
    { href: '/photographs', label: 'photographs' },
    { href: '/films', label: 'films' },
    { href: '/writing', label: 'writing' },
    { href: '/information', label: 'information' }
  ];

  return (
    <nav className={styles.nav}>
      {navItems.map(item => (
        <Link 
          key={item.href}
          href={item.href} 
          className={`${styles.navLink} ${activeNav === item.label ? styles.active : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
