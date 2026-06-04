'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../layout.module.css';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span>Cafe MH 14</span>
          <span className={styles.goldDot}>•</span>
        </Link>
        <ul className={styles.menuList}>
          <li>
            <Link 
              href="/menu" 
              className={`${styles.navLink} ${isActive('/menu') ? styles.navLinkActive : ''}`}
            >
              Menu
            </Link>
          </li>
          <li>
            <Link 
              href="/track" 
              className={`${styles.navLink} ${isActive('/track') ? styles.navLinkActive : ''}`}
            >
              Track Order
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard" 
              className={`${styles.navLink} ${isActive('/dashboard') ? styles.navLinkActive : ''}`}
            >
              Staff Portal
            </Link>
          </li>
        </ul>
        <Link href="/menu">
          <button className={styles.navBtn}>Order Now</button>
        </Link>
      </nav>
    </header>
  );
}
