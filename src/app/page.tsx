import Link from 'next/link';
import styles from './page.module.css';
import { formatPrice } from '@/lib/types';

export default function Home() {
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

  const previewItems = [
    {
      name: 'Royal Saffron Masala Chai',
      price: formatPrice(120),
      category: 'Tea',
      description: 'Brewed black tea infused with ginger, green cardamom, cloves, and premium Kashmiri saffron, simmered with whole milk.',
      image: '/images/masala_chai.png'
    },
    {
      name: 'South Indian Filter Kaapi',
      price: formatPrice(90),
      category: 'Coffee',
      description: 'Traditional double-filtered chicory blend, frothed by hand and served foaming in a brass dabarah.',
      image: '/images/filter_kaapi.png'
    },
    {
      name: 'Paneer Tikka Croissant',
      price: formatPrice(180),
      category: 'Bakery',
      description: 'Flaky puff pastry stuffed with tandoori-spiced cottage cheese cubes, bell peppers, and fresh coriander mint chutney.',
      image: '/images/paneer_croissant.png'
    }
  ];

  return (
    <div className="animate-fade">
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroTag}>Hand-crafted Luxury</div>
        <h1 className={styles.heroTitle}>
          Indulge in <span className="text-gradient-amber">Obsidian Elegance</span> & Golden Coffee Craft
        </h1>
        <p className={styles.heroDesc}>
          Step into a world of sensory refinement. Browse our curated menu of micro-lot coffees and delicate artisan pastries, place your order, and track its creation in real-time.
        </p>
        <div className={styles.heroActions}>
          <Link href="/menu">
            <button className="btn-primary">
              Explore Our Menu
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </Link>
          <Link href="/track">
            <button className="btn-secondary">Track Existing Order</button>
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className={styles.featureGrid}>
        {features.map((feature, i) => (
          <div key={i} className={`${styles.featureCard} glass`}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDesc}>{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Featured Menu Items Preview */}
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
              <div 
                className={styles.previewImage} 
                style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                {/* Visual Glassmorphic Accent inside image */}
                <div style={{
                  padding: '1.25rem 2rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  fontFamily: 'var(--font-heading)',
                  color: 'white',
                  letterSpacing: '0.05em'
                }}>
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
    </div>
  );
}
