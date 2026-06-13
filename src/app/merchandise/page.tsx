'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function MerchandisePage() {
  /* ─── Retail Coffee ─── */
  const coffeeItems = [
    {
      name: 'Chikmagalur Single-Origin Beans',
      price: '₹750',
      tag: 'Whole Bean · 250g',
      iconType: 'beans',
      desc: 'Roasted medium-dark to draw out bold notes of dark chocolate, toasted hazelnut, and a smooth citrus finish. Traceable to the estate, batch by batch.'
    },
    {
      name: 'Signature Blend Drip Bags',
      price: '₹550',
      tag: 'Box of 10 · Ready Brew',
      iconType: 'drip',
      desc: 'Single-serve drip bags prefilled with our medium-roasted arabica/chicory blend. Just add hot water — a bold highway-quality kaapi, anywhere.'
    },
    {
      name: 'Araku Valley Reserve',
      price: '₹950',
      tag: 'Limited Edition · 200g',
      iconType: 'beans',
      desc: 'A rare micro-lot from the misty Araku Valley. Light roast with notes of blueberry, brown sugar, and a floral jasmine finish. Seasonal availability.'
    }
  ];

  /* ─── Merchandise ─── */
  const merchandiseItems = [
    {
      name: 'Artisan Ceramic Mug',
      price: '₹450',
      tag: 'Handcrafted · 300ml',
      iconType: 'mug',
      desc: 'Heavy clay ceramic in matte obsidian, embossed with the Cafe MH 14 emblem in gold leaf. Microwave & dishwasher safe.'
    },
    {
      name: 'Insulated Stainless Bottle',
      price: '₹950',
      tag: 'Double-Wall · 500ml',
      iconType: 'bottle',
      desc: 'Double-walled vacuum flask in matte black. Keeps cold-brews chilled for 24 hours or hot masala chais steaming for 12.'
    },
    {
      name: 'Brass Logo Keychain',
      price: '₹250',
      tag: 'Solid Brass · Branded',
      iconType: 'keychain',
      desc: 'Satisfyingly weighted solid brass keychain bearing the Cafe MH 14 logo. Designed to develop a rich patina with age.'
    },
    {
      name: 'Canvas Tote Bag',
      price: '₹350',
      tag: 'Heavy Canvas · Printed',
      iconType: 'tote',
      desc: 'Thick cotton canvas tote with screen-printed Cafe MH 14 branding. Perfect for market runs or carrying your coffee essentials.'
    }
  ];

  /* ─── Handpicked Siders ─── */
  const siderItems = [
    {
      name: 'Salted Caramel Butter Biscuits',
      price: '₹180',
      tag: 'House-Baked · 6 pcs',
      iconType: 'biscuit',
      desc: 'Flaky, sweet-and-savory biscuits baked in high-fat cultured butter with a caramel glaze and sea salt finish.'
    },
    {
      name: 'Dark Chocolate Espresso Bark',
      price: '₹220',
      tag: 'Artisanal · 100g',
      iconType: 'chocolate',
      desc: 'Artisanal dark chocolate bark infused with our house-roasted coffee grounds and topped with flaked sea salt and crushed espresso beans.'
    },
    {
      name: 'Saffron Almond Biscotti',
      price: '₹200',
      tag: 'Twice-Baked · 4 pcs',
      iconType: 'biscotti',
      desc: 'Twice-baked almond biscotti perfumed with Kashmiri saffron. Crafted to be dunked into warm masala chai or filter kaapi.'
    }
  ];

  /* ─── Icon Helper ─── */
  const getIcon = (type: string) => {
    switch (type) {
      case 'beans': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      );
      case 'drip': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25" />
        </svg>
      );
      case 'mug': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 12h-.75V7.5a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25h11.25a2.25 2.25 0 002.25-2.25v-1.5h.75A2.25 2.25 0 0021 13.5v-1.5a2.25 2.25 0 00-2.25-2.25zm.75 3h-.75v-3h.75a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75z" />
        </svg>
      );
      case 'bottle': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
        </svg>
      );
      case 'keychain': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
        </svg>
      );
      case 'tote': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      );
      case 'biscuit': case 'biscotti': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Z" />
        </svg>
      );
      case 'chocolate': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        </svg>
      );
      default: return null;
    }
  };

  return (
    <div className="animate-fade">
      {/* Hero Banner */}
      <section className={styles.pageHero}>
        <div className={styles.pageHeroBg} />
        <div className={styles.pageHeroContent}>
          <div className={styles.pageTag}>🛍️ Lounge Merchandise</div>
          <h1 className={styles.pageTitle}>Take Cafe MH 14 Home</h1>
          <p className={styles.pageDesc}>
            Artisan beans, handcrafted accessories, and gourmet treats — curated for true coffee lovers who carry the craft with them.
          </p>
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Merchandise</span>
          </nav>
        </div>
      </section>

      {/* ── Retail Coffee ── */}
      <section className={styles.categorySection}>
        <div className={styles.categoryHeader}>
          <div className={styles.categoryLabel}>☕ Retail Coffee</div>
          <h2 className={styles.categoryTitle}>Artisanal Beans & Brews</h2>
          <p className={styles.categoryDesc}>Farm-to-cup specialty roasts and ready-brew packs. Every bag is traceable to the estate it came from.</p>
        </div>
        <div className={styles.productGrid}>
          {coffeeItems.map((item, idx) => (
            <div key={idx} className={`${styles.productCard} glass glass-hover`}>
              <div className={styles.productIcon}>{getIcon(item.iconType)}</div>
              <div className={styles.productInfo}>
                <span className={styles.productTag}>{item.tag}</span>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>{item.price}</span>
                  <button className={styles.addToCartBtn}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Merchandise ── */}
      <section className={styles.categorySection}>
        <div className={styles.categoryHeader}>
          <div className={styles.categoryLabel}>🛍️ Lounge Accessories</div>
          <h2 className={styles.categoryTitle}>Carry the Craft with You</h2>
          <p className={styles.categoryDesc}>Premium handcrafted accessories for your daily coffee ritual. Each piece carries the Cafe MH 14 story.</p>
        </div>
        <div className={styles.productGrid}>
          {merchandiseItems.map((item, idx) => (
            <div key={idx} className={`${styles.productCard} glass glass-hover`}>
              <div className={styles.productIcon}>{getIcon(item.iconType)}</div>
              <div className={styles.productInfo}>
                <span className={styles.productTag}>{item.tag}</span>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>{item.price}</span>
                  <button className={styles.addToCartBtn}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Handpicked Siders ── */}
      <section className={styles.categorySection}>
        <div className={styles.categoryHeader}>
          <div className={styles.categoryLabel}>🍫 Handpicked Siders</div>
          <h2 className={styles.categoryTitle}>Perfect Pairings</h2>
          <p className={styles.categoryDesc}>Artisan treats curated to complement every roast and blend we serve. Made for dunking, nibbling, and savouring.</p>
        </div>
        <div className={styles.productGrid}>
          {siderItems.map((item, idx) => (
            <div key={idx} className={`${styles.productCard} glass glass-hover`}>
              <div className={styles.productIcon}>{getIcon(item.iconType)}</div>
              <div className={styles.productInfo}>
                <span className={styles.productTag}>{item.tag}</span>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>{item.price}</span>
                  <button className={styles.addToCartBtn}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <h2>Looking for Bulk or Corporate Orders?</h2>
        <p>We offer custom branding and bulk pricing for businesses. Get a quote today.</p>
        <Link href="/corporate-gifting">
          <button className="btn-primary">
            Explore Corporate Gifting
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </Link>
      </section>
    </div>
  );
}
