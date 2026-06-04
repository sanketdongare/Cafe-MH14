import type { Metadata } from 'next';
import './globals.css';
import styles from './layout.module.css';
import Header from './components/Header';

export const metadata: Metadata = {
  title: "Cafe MH 14 | Premium Artisanal Cafe & Lounge",
  description: "Experience the art of artisanal coffee. Order premium single-origin pour overs, freshly baked delicacies, and gourmet tarts with live order tracking.",
  keywords: ["premium coffee", "cafe order management", "craft coffee", "Uji matcha", "gourmet bakery"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={styles.container}>
        <Header />
        
        <main className={styles.main}>
          {children}
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <h3>Cafe MH 14</h3>
              <p>Crafting elevated coffee and fine pastry experiences in an obsidian-glass lounge aesthetic.</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Lounge Hours</h4>
              <p>Mon - Fri: 7:00 AM - 9:00 PM</p>
              <p>Sat - Sun: 8:00 AM - 10:00 PM</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Contact</h4>
              <p>Cafe MH 14, Chakan, Pune Nashik Highway</p>
              <p>Pin code 410501</p>
            </div>
          </div>
          <div className={styles.copyright}>
            <span>&copy; {new Date().getFullYear()} Cafe MH 14. All rights reserved.</span>
            <span>Premium Taste, Hand-Crafted.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
