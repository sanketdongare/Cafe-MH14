'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '../layout.module.css';

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  const isHashActive = (hash: string) => {
    return pathname === '/' && false; // hash links don't affect pathname; styling is cosmetic only
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span>Cafe MH 14</span>
          <span className={styles.goldDot}>•</span>
        </Link>

        {/* Desktop nav */}
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
              href="/merchandise"
              className={`${styles.navLink} ${isActive('/merchandise') ? styles.navLinkActive : ''}`}
            >
              🛍️ Merchandise
            </Link>
          </li>
          <li>
            <Link
              href="/corporate-gifting"
              className={`${styles.navLink} ${isActive('/corporate-gifting') ? styles.navLinkActive : ''}`}
            >
              🎁 Gifting
            </Link>
          </li>
          <li>
            <Link
              href="/reviews"
              className={`${styles.navLink} ${isActive('/reviews') ? styles.navLinkActive : ''}`}
            >
              ⭐ Reviews
            </Link>
          </li>
          <li>
            <Link
              href="/reserve"
              className={`${styles.navLink} ${isActive('/reserve') ? styles.navLinkActive : ''}`}
            >
              📅 Book Table
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

        <Link href="/menu" className={styles.navBtnDesktop}>
          <button className={styles.navBtn}>Order Now</button>
        </Link>

        {/* Hamburger button (mobile) */}
        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
        </button>
      </nav>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <ul className={styles.mobileMenuList}>
              <li>
                <Link href="/menu" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/merchandise" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>
                  🛍️ Lounge Merchandise
                </Link>
              </li>
              <li>
                <Link href="/corporate-gifting" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>
                  🎁 Corporate Gifting
                </Link>
              </li>
              <li>
                <Link href="/reviews" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>
                  ⭐ Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/reserve" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>
                  📅 Book a Table
                </Link>
              </li>
              <li>
                <Link href="/track" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /></svg>
                  Staff Portal
                </Link>
              </li>
            </ul>
            <Link href="/menu" className={styles.mobileOrderBtn} onClick={() => setMobileOpen(false)}>
              <button className={styles.navBtn} style={{ width: '100%', justifyContent: 'center' }}>Order Now</button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
