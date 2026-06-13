'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './page.module.css';
import { formatPrice } from '@/lib/types';

export default function Home() {
  /* ─── Contact Form State ─── */
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'general', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    const subject = encodeURIComponent(`Cafe MH 14 Inquiry: [${contactForm.subject.toUpperCase()}] from ${contactForm.name}`);
    const body = encodeURIComponent(`Name: ${contactForm.name}\nEmail: ${contactForm.email}\nSubject: ${contactForm.subject}\n\nMessage:\n${contactForm.message}`);
    window.location.href = `mailto:sanketdongare89@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => setFormSubmitted(false), 4000);
    setContactForm({ name: '', email: '', subject: 'general', message: '' });
  };

  /* ─── Corporate Gifting Form State ─── */
  const [giftingForm, setGiftingForm] = useState({ name: '', company: '', email: '', selection: 'box', quantity: '', details: '' });
  const [giftingSubmitted, setGiftingSubmitted] = useState(false);

  const handleGiftingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGiftingSubmitted(true);
    const subject = encodeURIComponent(`Corporate Gifting Inquiry from ${giftingForm.company} — ${giftingForm.selection}`);
    const body = encodeURIComponent(`Name: ${giftingForm.name}\nCompany: ${giftingForm.company}\nEmail: ${giftingForm.email}\nProduct: ${giftingForm.selection}\nQuantity: ${giftingForm.quantity}\n\nAdditional Details:\n${giftingForm.details}`);
    window.location.href = `mailto:sanketdongare89@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => setGiftingSubmitted(false), 4000);
    setGiftingForm({ name: '', company: '', email: '', selection: 'box', quantity: '', details: '' });
  };

  /* ─── Features ─── */
  const features = [
    {
      title: 'Artisanal Roasts',
      description: 'Single-origin beans curated from micro-lot farms, roasted to release complex notes of chocolate, stone fruit, and jasmine.',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v1.244c0 .892-.606 1.673-1.488 1.838a11.968 11.968 0 0 0-3.35 1.547c-.702.438-1.077 1.258-1.077 2.072v7.199c0 1.237 1.01 2.228 2.228 2.228h11.874c1.217 0 2.228-.99 2.228-2.228V9.864c0-.814-.375-1.634-1.077-2.072a11.967 11.967 0 0 0-3.35-1.547c-.882-.165-1.488-.946-1.488-1.838V3.104c0-.502-.408-.91-.91-.91h-3.414c-.502 0-.91.408-.91.91Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5h6m-6 3h3" />
        </svg>
      )
    },
    {
      title: 'Velvet Pastry Craft',
      description: 'House-made, premium French-style pastries baked fresh at dawn, using high-fat cultured butter and organic flours.',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
        </svg>
      )
    },
    {
      title: 'Precision Order Flow',
      description: 'Submit customizations, select options, and track preparation progress in real-time as your drink is being hand-crafted.',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    }
  ];

  /* ─── Preview Items ─── */
  const previewItems = [
    { name: 'Royal Saffron Masala Chai', price: formatPrice(120), category: 'Tea', description: 'Brewed black tea infused with ginger, green cardamom, cloves, and premium Kashmiri saffron, simmered with whole milk.' },
    { name: 'South Indian Filter Kaapi', price: formatPrice(90), category: 'Coffee', description: 'Traditional double-filtered chicory blend, frothed by hand and served foaming in a brass dabarah.' },
    { name: 'Paneer Tikka Croissant', price: formatPrice(180), category: 'Bakery', description: 'Flaky puff pastry stuffed with tandoori-spiced cottage cheese cubes, bell peppers, and fresh coriander mint chutney.' }
  ];

  /* ─── Retail Categories ─── */
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
    }
  ];

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
    }
  ];

  const siderItems = [
    {
      name: 'Salted Caramel Butter Biscuits',
      price: '₹180',
      tag: 'House-Baked · 6 pcs',
      iconType: 'biscuit',
      desc: 'Flaky, sweet-and-savory biscuits baked in high-fat cultured butter with a caramel glaze and sea salt finish. The perfect crunch to cut through rich coffee.'
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

  /* ─── Corporate Gift Products ─── */
  const giftProducts = [
    {
      name: 'Curated Gift Box',
      desc: 'A beautifully assembled box containing single-origin beans, a ceramic mug, biscotti, and espresso bark. Custom-branded ribbons and inserts available.',
      tag: 'Most Popular',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="32" height="32">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
      )
    },
    {
      name: 'Branded Water Bottles',
      desc: 'Matte-black double-wall insulated stainless bottles laser-engraved with your company logo. Minimum order: 25 units.',
      tag: 'Custom Branding',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="32" height="32">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        </svg>
      )
    },
    {
      name: 'Branded Ceramic Mugs',
      desc: 'Artisan matte-obsidian mugs embossed with your brand and our gold emblem. Each mug arrives in a premium kraft box. Min. 20 units.',
      tag: 'Premium Craft',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="32" height="32">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 12h-.75V7.5a2.25 2.25 0 0 0-2.25-2.25H4.5A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25h11.25a2.25 2.25 0 0 0 2.25-2.25v-1.5h.75A2.25 2.25 0 0 0 21 13.5v-1.5a2.25 2.25 0 0 0-2.25-2.25zm.75 3h-.75v-3h.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75z" />
        </svg>
      )
    },
    {
      name: 'Logo Keychains',
      desc: 'Solid brass keychains etched with your company name on one side and Cafe MH 14 on the other. Economical yet premium. Min. 50 units.',
      tag: 'Budget-Friendly',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="32" height="32">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
        </svg>
      )
    }
  ];

  /* ─── SVG Icon Helper ─── */
  const getItemIcon = (type: string) => {
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

  /* ─── Shop Category Renderer ─── */
  const ShopSubGrid = ({ items }: { items: typeof coffeeItems }) => (
    <div className={styles.shopSubGrid}>
      {items.map((item, idx) => (
        <div key={idx} className={`${styles.shopCard} glass glass-hover`}>
          <div className={styles.shopCardImage}>
            {getItemIcon(item.iconType)}
          </div>
          <div className={styles.shopCardInfo}>
            <span className={styles.shopCardTag}>{item.tag}</span>
            <h4>{item.name}</h4>
            <p>{item.desc}</p>
            <div className={styles.shopCardFooter}>
              <span className={styles.shopCardPrice}>{item.price}</span>
              <button className={styles.shopCardBtn}>
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
  );

  return (
    <div className="animate-fade">

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section className={styles.heroSection} id="home">
        {/* Animated background elements */}
        <div className={styles.heroBgOrbs}>
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
          <div className={styles.heroOrb3} />
        </div>

        {/* Decorative gold corner filigrees */}
        <div className={styles.heroFiligreeTL}>
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2C2 2 2 60 2 80C2 100 20 118 40 118" stroke="url(#goldGrad)" strokeWidth="1" opacity="0.4"/>
            <path d="M12 2C12 2 12 50 12 68C12 86 28 102 44 102" stroke="url(#goldGrad)" strokeWidth="0.5" opacity="0.25"/>
            <circle cx="2" cy="2" r="2" fill="url(#goldGrad)" opacity="0.6"/>
            <defs><linearGradient id="goldGrad" x1="0" y1="0" x2="120" y2="120"><stop stopColor="#f59e0b"/><stop offset="1" stopColor="#78350f"/></linearGradient></defs>
          </svg>
        </div>
        <div className={styles.heroFiligreeBR}>
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M118 118C118 118 118 60 118 40C118 20 100 2 80 2" stroke="url(#goldGrad2)" strokeWidth="1" opacity="0.4"/>
            <path d="M108 118C108 118 108 70 108 52C108 34 92 18 76 18" stroke="url(#goldGrad2)" strokeWidth="0.5" opacity="0.25"/>
            <circle cx="118" cy="118" r="2" fill="url(#goldGrad2)" opacity="0.6"/>
            <defs><linearGradient id="goldGrad2" x1="120" y1="120" x2="0" y2="0"><stop stopColor="#f59e0b"/><stop offset="1" stopColor="#78350f"/></linearGradient></defs>
          </svg>
        </div>

        {/* Main hero content */}
        <div className={styles.heroInner}>
          {/* Left: Text content */}
          <div className={styles.heroText}>
            <div className={styles.heroTag}>
              <span className={styles.heroTagDot} />
              Est. Chakan · Pune–Nashik Highway
            </div>

            <h1 className={styles.heroTitle}>
              Where Every Cup<br />
              Is a <span className={styles.heroTitleAccent}>Masterpiece</span>
            </h1>

            <div className={styles.heroDivider}>
              <svg viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="6" x2="70" y2="6" stroke="url(#divGrad)" strokeWidth="0.5"/>
                <path d="M80 6L90 1L100 6L90 11Z" fill="url(#divGrad)" opacity="0.6"/>
                <line x1="110" y1="6" x2="200" y2="6" stroke="url(#divGrad)" strokeWidth="0.5"/>
                <defs><linearGradient id="divGrad" x1="0" y1="0" x2="200" y2="0"><stop stopColor="transparent"/><stop offset="0.5" stopColor="#f59e0b"/><stop offset="1" stopColor="transparent"/></linearGradient></defs>
              </svg>
            </div>

            <p className={styles.heroDesc}>
              Single-origin micro-lot roasts. Artisan French pastries baked at dawn. An obsidian-and-gold lounge experience on the highway, crafted for those who never settle.
            </p>

            <div className={styles.heroActions}>
              <Link href="/menu">
                <button className={styles.heroBtnPrimary}>
                  <span>Explore Our Menu</span>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </Link>
              <Link href="/track">
                <button className={styles.heroBtnSecondary}>
                  Track Order
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className={styles.heroTrust}>
              <div className={styles.heroTrustItem}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>
                <span>Direct Trade</span>
              </div>
              <div className={styles.heroTrustSep} />
              <div className={styles.heroTrustItem}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /></svg>
                <span>Fresh Roasted Daily</span>
              </div>
              <div className={styles.heroTrustSep} />
              <div className={styles.heroTrustItem}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                <span>Crafted with Love</span>
              </div>
            </div>
          </div>

          {/* Right: Decorative emblem with animated steam */}
          <div className={styles.heroEmblem}>
            <div className={styles.heroEmblemRing}>
              <div className={styles.heroEmblemRingInner}>
                {/* Animated steam wisps */}
                <div className={styles.heroSteamContainer}>
                  <div className={`${styles.heroSteam} ${styles.heroSteam1}`} />
                  <div className={`${styles.heroSteam} ${styles.heroSteam2}`} />
                  <div className={`${styles.heroSteam} ${styles.heroSteam3}`} />
                </div>
                {/* Coffee cup icon */}
                <svg className={styles.heroEmblemIcon} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 48h32a4 4 0 0 0 4-4V24H8v20a4 4 0 0 0 4 4Z" stroke="url(#cupGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M48 28h4a6 6 0 0 1 0 12h-4" stroke="url(#cupGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 56h36" stroke="url(#cupGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                  <defs><linearGradient id="cupGrad" x1="8" y1="24" x2="56" y2="56"><stop stopColor="#f59e0b"/><stop offset="1" stopColor="#d97706"/></linearGradient></defs>
                </svg>
                <div className={styles.heroEmblemText}>
                  <span className={styles.heroEmblemBrand}>Cafe MH 14</span>
                  <span className={styles.heroEmblemSub}>SPECIALTY ROASTERS</span>
                </div>
              </div>
            </div>
            {/* Orbiting dot */}
            <div className={styles.heroOrbitDot} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FEATURES ══════════════════════════ */}
      <section className={styles.featureGrid}>
        {features.map((feature, i) => (
          <div key={i} className={`${styles.featureCard} glass`}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDesc}>{feature.description}</p>
          </div>
        ))}
      </section>

      {/* ══════════════════════════ MENU PREVIEW ══════════════════════════ */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Signature Brews & Pastries</h2>
            <p className={styles.sectionDesc}>A sneak peek into our lounge specials, created with rare ingredients.</p>
          </div>
          <Link href="/menu" className={styles.viewAllLink}>
            <span>View Full Menu</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
        <div className={styles.previewGrid}>
          {previewItems.map((item, idx) => (
            <div key={idx} className={`${styles.previewCard} glass glass-hover`}>
              <div className={styles.previewImage}>
                <div className={styles.previewSeal}>
                  {item.name.split(' ').map(w => w[0]).join('')}
                </div>
              </div>
              <div className={styles.previewDetails}>
                <div className={styles.previewHeader}>
                  <h3 className={styles.previewName}>{item.name}</h3>
                  <span className={styles.previewPrice}>{item.price}</span>
                </div>
                <p className={styles.previewDesc}>{item.description}</p>
                <div className={styles.previewFooter}>
                  <span className={styles.categoryTag}>{item.category}</span>
                  <Link href="/menu" style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 600 }}>
                    Customize &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════ ABOUT / OUR STORY ══════════════════════════ */}
      <section className={styles.aboutSection} id="about">
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTag}>Our Story</div>
            <h2 className={styles.sectionTitle}>The Heart Behind Every Cup</h2>
            <p className={styles.sectionDesc}>Where passion meets precision — a journey from bean to bliss.</p>
          </div>
        </div>
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <div className={`${styles.aboutStoryCard} glass`}>
              <div className={styles.aboutStoryIcon}>
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                </svg>
              </div>
              <div>
                <h4>Born on the Highway</h4>
                <p>Cafe MH 14 was born from a simple dream — to create a warm haven on the bustling Pune-Nashik Highway at Chakan. Founded by Sanket Dongare, a coffee enthusiast who believed that great coffee shouldn&apos;t require a trip to the city. What started as a small roadside stop has grown into a community landmark.</p>
              </div>
            </div>
            <div className={`${styles.aboutStoryCard} glass`}>
              <div className={styles.aboutStoryIcon}>
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
              </div>
              <div>
                <h4>Direct Trade Sourcing</h4>
                <p>We source our beans through direct trade with micro-lot farms across Chikmagalur, Coorg, and Araku Valley. Every bag is traceable to the farm it came from. Our teas are handpicked from Nilgiri and Darjeeling estates. No middlemen — fair prices, superior quality.</p>
              </div>
            </div>
            <div className={`${styles.aboutStoryCard} glass`}>
              <div className={styles.aboutStoryIcon}>
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </div>
              <div>
                <h4>Our Philosophy</h4>
                <p>We believe every cup tells a story. Our space is designed to be a retreat — where highway travelers, local families, and coffee aficionados converge. Slow-brewed attention to detail, zero compromise on freshness, and a community-first approach define who we are.</p>
              </div>
            </div>
          </div>
          <div className={styles.aboutStatsGrid}>
            <div className={`${styles.aboutStatCard} glass`}>
              <span className={styles.statNumber}>5+</span>
              <span className={styles.statLabel}>Years of Craft</span>
              <p className={styles.statDesc}>Pouring joy and micro-lot specialty brews on the highway.</p>
            </div>
            <div className={`${styles.aboutStatCard} glass`}>
              <span className={styles.statNumber}>12+</span>
              <span className={styles.statLabel}>Direct Estates</span>
              <p className={styles.statDesc}>Beans sourced ethically, directly from heritage shade-grown plantations.</p>
            </div>
            <div className={`${styles.aboutStatCard} glass`}>
              <span className={styles.statNumber}>10k+</span>
              <span className={styles.statLabel}>Frothed Cups</span>
              <p className={styles.statDesc}>Crafted for travelers, locals, and coffee lovers alike.</p>
            </div>
            <div className={`${styles.aboutStatCard} glass`}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Artisanal Integrity</span>
              <p className={styles.statDesc}>Handpicked quality, frothed by hand, zero exceptions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ RETAIL & MERCHANDISE ══════════════════════════ */}
      <section className={styles.shopSection} id="shop">
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTag}>Shop & Order</div>
            <h2 className={styles.sectionTitle}>Take Cafe MH 14 Home</h2>
            <p className={styles.sectionDesc}>Order for pickup, delivery, or shop our retail collection of artisan beans, merchandise & gourmet siders.</p>
          </div>
        </div>

        {/* Pickup / Delivery Options */}
        <div className={styles.orderOptionsGrid}>
          <div className={`${styles.orderOptionCard} glass glass-hover`}>
            <div className={styles.orderOptionIcon}>
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
            </div>
            <h3>Local Pickup</h3>
            <p>Order ahead and skip the wait. Your beverage will be ready when you arrive — hot, fresh, and perfectly crafted.</p>
            <Link href="/menu" className={styles.orderOptionBtn}>Order for Pickup →</Link>
          </div>
          <div className={`${styles.orderOptionCard} glass glass-hover`}>
            <div className={styles.orderOptionIcon}>
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <h3>Home Delivery</h3>
            <p>Can&apos;t make it to the cafe? We deliver within a 10 km radius of Chakan. Hot drinks in insulated flasks!</p>
            <Link href="/menu" className={styles.orderOptionBtn}>Order Delivery →</Link>
          </div>
          <div className={`${styles.orderOptionCard} glass glass-hover`}>
            <div className={styles.orderOptionIcon}>
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            </div>
            <h3>Catering & Events</h3>
            <p>Hosting a party or corporate event? We offer bespoke catering packages with custom menus and live coffee stations.</p>
            <a href="#contact" className={styles.orderOptionBtn}>Enquire Now →</a>
          </div>
        </div>

        {/* ── Retail Coffee ── */}
        <div className={styles.shopCategoryHeader}>
          <div className={styles.shopCategoryLabel}>☕ Retail Coffee</div>
          <h3 className={styles.shopCategoryTitle}>Artisanal Beans & Brews</h3>
          <p className={styles.shopCategoryDesc}>Farm-to-cup specialty roasts and ready-brew packs for true coffee lovers.</p>
        </div>
        <ShopSubGrid items={coffeeItems} />

        {/* ── Merchandise ── */}
        <div className={styles.shopCategoryHeader}>
          <div className={styles.shopCategoryLabel}>🛍️ Lounge Merchandise</div>
          <h3 className={styles.shopCategoryTitle}>Carry the Craft with You</h3>
          <p className={styles.shopCategoryDesc}>Premium handcrafted accessories for your daily coffee ritual.</p>
        </div>
        <ShopSubGrid items={merchandiseItems} />

        {/* ── Handpicked Siders ── */}
        <div className={styles.shopCategoryHeader}>
          <div className={styles.shopCategoryLabel}>🍫 Handpicked Siders</div>
          <h3 className={styles.shopCategoryTitle}>Perfect Pairings</h3>
          <p className={styles.shopCategoryDesc}>Artisan treats curated to complement every roast and blend we serve.</p>
        </div>
        <ShopSubGrid items={siderItems} />
      </section>

      {/* ══════════════════════════ CORPORATE GIFTING ══════════════════════════ */}
      <section className={styles.giftingSection} id="gifting">
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTag}>Corporate Gifting</div>
            <h2 className={styles.sectionTitle}>Distinguish Your Corporate Gifting</h2>
            <p className={styles.sectionDesc}>Premium branded experiences for your team and clients.</p>
          </div>
        </div>

        <div className={styles.giftingContent}>
          {/* Left: Pitch + Products */}
          <div className={styles.giftingLeft}>
            <div className={`${styles.giftingPitch} glass`}>
              <div className={styles.giftingPitchIcon}>
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="28" height="28">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <div>
                <h4>Why Cafe MH 14 for Corporate Gifts?</h4>
                <p>At Cafe MH 14, we translate our passion for artisanal roasts and handcrafted detail into premium corporate experiences. Reward your team or thank your clients with bespoke gift boxes and high-end branded merchandise — hand-selected direct-trade beans, laser-engraved designs, and reliable Pune-region delivery.</p>
              </div>
            </div>

            <div className={styles.giftingGrid}>
              {giftProducts.map((product, idx) => (
                <div key={idx} className={`${styles.giftingCard} glass glass-hover`}>
                  {product.tag === 'Most Popular' && (
                    <div className={styles.giftingBadge}>⭐ Most Popular</div>
                  )}
                  <div className={styles.giftingCardIcon}>{product.icon}</div>
                  <h4>{product.name}</h4>
                  <p>{product.desc}</p>
                  <span className={styles.giftingCardTag}>{product.tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Inquiry Form */}
          <div className={`${styles.giftingFormCard} glass`}>
            <h3>Request a Corporate Quote</h3>
            <p className={styles.contactFormSubtext}>Tell us what you need — we&apos;ll get back within 24 hours with a custom quote.</p>

            {giftingSubmitted && (
              <div className={styles.formSuccess}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Thank you! Your enquiry has been sent to sanketdongare89@gmail.com.
              </div>
            )}

            <form onSubmit={handleGiftingSubmit} className={styles.contactForm}>
              <div className={styles.contactFormRow}>
                <div className={styles.contactInputGroup}>
                  <label htmlFor="gifting-name">Your Name *</label>
                  <input id="gifting-name" type="text" required placeholder="Sanket Dongare"
                    value={giftingForm.name} onChange={(e) => setGiftingForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className={styles.contactInputGroup}>
                  <label htmlFor="gifting-company">Company Name *</label>
                  <input id="gifting-company" type="text" required placeholder="Acme Corp Ltd."
                    value={giftingForm.company} onChange={(e) => setGiftingForm(p => ({ ...p, company: e.target.value }))} />
                </div>
              </div>
              <div className={styles.contactInputGroup}>
                <label htmlFor="gifting-email">Work Email *</label>
                <input id="gifting-email" type="email" required placeholder="sanket@company.com"
                  value={giftingForm.email} onChange={(e) => setGiftingForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className={styles.contactFormRow}>
                <div className={styles.contactInputGroup}>
                  <label htmlFor="gifting-product">Product of Interest</label>
                  <select id="gifting-product" value={giftingForm.selection}
                    onChange={(e) => setGiftingForm(p => ({ ...p, selection: e.target.value }))}>
                    <option value="box">Curated Gift Box</option>
                    <option value="bottle">Branded Water Bottles</option>
                    <option value="mug">Branded Ceramic Mugs</option>
                    <option value="keychain">Logo Keychains</option>
                    <option value="custom">Custom Bundle</option>
                  </select>
                </div>
                <div className={styles.contactInputGroup}>
                  <label htmlFor="gifting-qty">Quantity Needed</label>
                  <input id="gifting-qty" type="number" min="1" placeholder="e.g. 50"
                    value={giftingForm.quantity} onChange={(e) => setGiftingForm(p => ({ ...p, quantity: e.target.value }))} />
                </div>
              </div>
              <div className={styles.contactInputGroup}>
                <label htmlFor="gifting-details">Additional Details</label>
                <textarea id="gifting-details" rows={4} placeholder="Custom branding requirements, delivery dates, budget, etc."
                  value={giftingForm.details} onChange={(e) => setGiftingForm(p => ({ ...p, details: e.target.value }))} />
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
                Send Corporate Inquiry
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ CONTACT / LOCATIONS ══════════════════════════ */}
      <section className={styles.contactSection} id="contact">
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTag}>Get in Touch</div>
            <h2 className={styles.sectionTitle}>Visit Us or Say Hello</h2>
            <p className={styles.sectionDesc}>We&apos;d love to hear from you — for catering, events, feedback, or partnerships.</p>
          </div>
        </div>
        <div className={styles.contactLayout}>
          <div className={styles.contactMapContainer}>
            <iframe
              className={styles.contactMap}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.5!2d73.86!3d18.76!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDQ1JzM2LjAiTiA3M8KwNTEnMzYuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Cafe MH 14 Location"
            ></iframe>
            <div className={styles.contactMapOverlayInfo}>
              <div className={styles.contactInfoCards}>
                <div className={`${styles.contactInfoCard} glass`}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <div>
                    <strong>Address</strong>
                    <p>Cafe MH 14, Chakan<br />Pune Nashik Highway<br />Pin code 410501</p>
                  </div>
                </div>
                <div className={`${styles.contactInfoCard} glass`}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <div>
                    <strong>Hours</strong>
                    <p>Mon – Fri: 7:00 AM – 9:00 PM<br />Sat – Sun: 8:00 AM – 10:00 PM</p>
                  </div>
                </div>
                <div className={`${styles.contactInfoCard} glass`}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <div>
                    <strong>Phone</strong>
                    <p>+91 70837 01098</p>
                  </div>
                </div>
                <div className={`${styles.contactInfoCard} glass`}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <div>
                    <strong>Email</strong>
                    <p><a href="mailto:sanketdongare89@gmail.com" style={{ color: 'var(--accent-gold)' }}>sanketdongare89@gmail.com</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.contactFormCard} glass`}>
            <h3>Send Us a Message</h3>
            <p className={styles.contactFormSubtext}>For catering, events, feedback, or partnerships.</p>
            {formSubmitted && (
              <div className={styles.formSuccess}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Thank you! We&apos;ll get back to you within 24 hours.
              </div>
            )}
            <form onSubmit={handleContactSubmit} className={styles.contactForm}>
              <div className={styles.contactFormRow}>
                <div className={styles.contactInputGroup}>
                  <label htmlFor="contact-name">Your Name *</label>
                  <input id="contact-name" type="text" required placeholder="e.g. Sanket Dongare"
                    value={contactForm.name} onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className={styles.contactInputGroup}>
                  <label htmlFor="contact-email">Email *</label>
                  <input id="contact-email" type="email" required placeholder="sanket@example.com"
                    value={contactForm.email} onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div className={styles.contactInputGroup}>
                <label htmlFor="contact-subject">Subject</label>
                <select id="contact-subject" value={contactForm.subject}
                  onChange={(e) => setContactForm(p => ({ ...p, subject: e.target.value }))}>
                  <option value="general">General Inquiry</option>
                  <option value="catering">Catering Request</option>
                  <option value="events">Private Events</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership / Collaboration</option>
                </select>
              </div>
              <div className={styles.contactInputGroup}>
                <label htmlFor="contact-message">Message *</label>
                <textarea id="contact-message" required rows={5} placeholder="Tell us what&apos;s on your mind..."
                  value={contactForm.message} onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))} />
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
                Send Message
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </form>
            <div className={styles.socialSection}>
              <span className={styles.socialLabel}>Follow Us</span>
              <div className={styles.socialLinks}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/></svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter/X">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://wa.me/917083701098" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
