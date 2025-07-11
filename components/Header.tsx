import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const router = useRouter();
  
  const toggleMenu = (): void => {
    setMenuOpen(!menuOpen);
  };

  // Close menu when route changes
  const handleLinkClick = (): void => {
    setMenuOpen(false);
  };

  // Helper function to check if a link is active
  const isActive = (path: string): boolean => {
    return router.pathname === path || 
           (path !== '/' && router.pathname.startsWith(path));
  };

  return (
    <header className={styles.header}>
      <div className={styles.nameContainer}>
        <Link href="/" className={styles.name}>
          Ethan MacCumber
        </Link>
      </div>
      <div className={styles.navArea}>
        <button 
          className={styles.menuToggle} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className={`${styles.menuIcon} ${menuOpen ? styles.menuIconOpen : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <Link 
            href="/photographs" 
            className={`${styles.navLink} ${isActive('/photographs') ? styles.active : ''}`}
            onClick={handleLinkClick}
          >
            photographs
          </Link>
          <Link 
            href="/films" 
            className={`${styles.navLink} ${isActive('/films') ? styles.active : ''}`}
            onClick={handleLinkClick}
          >
            films
          </Link>
          <Link 
            href="/writing" 
            className={`${styles.navLink} ${isActive('/writing') ? styles.active : ''}`}
            onClick={handleLinkClick}
          >
            writing
          </Link>
          <Link 
            href="/information" 
            className={`${styles.navLink} ${isActive('/information') ? styles.active : ''}`}
            onClick={handleLinkClick}
          >
            information
          </Link>
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}