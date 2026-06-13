'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './page.module.css';

export default function CorporateGiftingPage() {
  /* ─── Form State ─── */
  const [form, setForm] = useState({ name: '', company: '', email: '', selection: 'box', quantity: '', details: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const subject = encodeURIComponent(`Corporate Gifting Inquiry from ${form.company} — ${form.selection}`);
    const body = encodeURIComponent(`Name: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\nProduct: ${form.selection}\nQuantity: ${form.quantity}\n\nAdditional Details:\n${form.details}`);
    window.location.href = `mailto:sanketdongare89@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', company: '', email: '', selection: 'box', quantity: '', details: '' });
  };

  /* ─── Gift Products ─── */
  const giftProducts = [
    {
      name: 'Curated Gift Box',
      desc: 'A beautifully assembled box containing single-origin beans, a ceramic mug, biscotti, and espresso bark. Custom-branded ribbons and inserts available.',
      tag: 'Most Popular',
      minOrder: 'Min. 10 units',
      priceRange: '₹1,800 – ₹2,500',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="40" height="40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
      )
    },
    {
      name: 'Branded Water Bottles',
      desc: 'Matte-black double-wall insulated stainless bottles laser-engraved with your company logo. Keeps beverages at temperature for up to 24 hours.',
      tag: 'Custom Branding',
      minOrder: 'Min. 25 units',
      priceRange: '₹850 – ₹1,100',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="40" height="40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        </svg>
      )
    },
    {
      name: 'Branded Ceramic Mugs',
      desc: 'Artisan matte-obsidian mugs embossed with your brand alongside our gold emblem. Each mug arrives in a premium kraft box with tissue wrapping.',
      tag: 'Premium Craft',
      minOrder: 'Min. 20 units',
      priceRange: '₹400 – ₹550',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="40" height="40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 12h-.75V7.5a2.25 2.25 0 0 0-2.25-2.25H4.5A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25h11.25a2.25 2.25 0 0 0 2.25-2.25v-1.5h.75A2.25 2.25 0 0 0 21 13.5v-1.5a2.25 2.25 0 0 0-2.25-2.25zm.75 3h-.75v-3h.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75z" />
        </svg>
      )
    },
    {
      name: 'Logo Keychains',
      desc: 'Solid brass keychains etched with your company name on one side and Cafe MH 14 on the other. Economical yet premium — a memorable takeaway.',
      tag: 'Budget-Friendly',
      minOrder: 'Min. 50 units',
      priceRange: '₹200 – ₹300',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="40" height="40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
        </svg>
      )
    },
    {
      name: 'Coffee Bean Gift Packs',
      desc: 'Trio or duo packs of our signature single-origin beans in branded tins. Choose from Chikmagalur, Araku Valley, or Coorg Estate blends.',
      tag: 'New',
      minOrder: 'Min. 15 units',
      priceRange: '₹1,200 – ₹1,800',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="40" height="40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      )
    },
    {
      name: 'Custom Bundle',
      desc: 'Mix and match any of our products into a bespoke corporate package. We handle curation, branding, packaging, and delivery — end to end.',
      tag: 'Fully Custom',
      minOrder: 'Flexible',
      priceRange: 'Quote on request',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="40" height="40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      )
    }
  ];

  /* ─── Why Us Points ─── */
  const whyUs = [
    { title: 'Direct-Trade Quality', desc: 'Every bean and ingredient is sourced directly from estates and micro-lot farms — no middlemen, just premium craft.' },
    { title: 'Custom Branding', desc: 'Laser engraving, screen printing, and custom packaging tailored to your brand identity. Your logo, our craft.' },
    { title: 'Pune-Region Delivery', desc: 'Reliable delivery across Pune, PCMC, and Chakan industrial zones. Bulk orders dispatched within 7–10 business days.' },
    { title: 'Flexible MOQs', desc: 'Starting from as low as 10 units for gift boxes. We work with startups and enterprises alike.' }
  ];

  return (
    <div className="animate-fade">
      {/* Hero Banner */}
      <section className={styles.pageHero}>
        <div className={styles.pageHeroBg} />
        <div className={styles.pageHeroContent}>
          <div className={styles.pageTag}>🎁 Corporate Gifting</div>
          <h1 className={styles.pageTitle}>Distinguish Your Corporate Gifting</h1>
          <p className={styles.pageDesc}>
            Premium branded experiences for your team and clients. Artisanal coffee, handcrafted merchandise, and bespoke packaging — all from Cafe MH 14.
          </p>
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Corporate Gifting</span>
          </nav>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.whySection}>
        <div className={styles.whySectionHeader}>
          <h2>Why Companies Choose Cafe MH 14</h2>
          <p>We translate our passion for artisanal roasts and handcrafted detail into premium corporate experiences.</p>
        </div>
        <div className={styles.whyGrid}>
          {whyUs.map((item, idx) => (
            <div key={idx} className={`${styles.whyCard} glass`}>
              <div className={styles.whyNumber}>0{idx + 1}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Catalog */}
      <section className={styles.catalogSection}>
        <div className={styles.catalogHeader}>
          <div className={styles.catalogLabel}>Our Products</div>
          <h2>Corporate Gift Catalog</h2>
          <p>Browse our curated range of gifts and branded merchandise. All items are customizable.</p>
        </div>
        <div className={styles.catalogGrid}>
          {giftProducts.map((product, idx) => (
            <div key={idx} className={`${styles.catalogCard} glass glass-hover`}>
              {product.tag === 'Most Popular' && (
                <div className={styles.popularBadge}>⭐ Most Popular</div>
              )}
              {product.tag === 'New' && (
                <div className={styles.newBadge}>✨ New</div>
              )}
              <div className={styles.catalogCardIcon}>{product.icon}</div>
              <h3>{product.name}</h3>
              <p className={styles.catalogCardDesc}>{product.desc}</p>
              <div className={styles.catalogCardMeta}>
                <span className={styles.catalogPriceRange}>{product.priceRange}</span>
                <span className={styles.catalogMinOrder}>{product.minOrder}</span>
              </div>
              <span className={styles.catalogCardTag}>{product.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.processSection}>
        <h2>How It Works</h2>
        <div className={styles.processGrid}>
          <div className={`${styles.processStep} glass`}>
            <div className={styles.processStepNum}>1</div>
            <h3>Submit Inquiry</h3>
            <p>Fill out the form below with your requirements — product, quantity, branding needs, and timeline.</p>
          </div>
          <div className={styles.processArrow}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
          <div className={`${styles.processStep} glass`}>
            <div className={styles.processStepNum}>2</div>
            <h3>Receive Quote</h3>
            <p>We&apos;ll reply within 24 hours with a detailed quote, mockup options, and delivery timeline.</p>
          </div>
          <div className={styles.processArrow}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
          <div className={`${styles.processStep} glass`}>
            <div className={styles.processStepNum}>3</div>
            <h3>Approve & Deliver</h3>
            <p>Approve the design, confirm the order, and we handle production, packaging, and delivery.</p>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className={styles.formSection} id="inquiry">
        <div className={styles.formSectionInner}>
          <div className={styles.formInfo}>
            <h2>Request a Corporate Quote</h2>
            <p>Tell us what you need — we&apos;ll get back within 24 hours with a custom quote and mockup options.</p>
            <div className={styles.formContactInfo}>
              <div className={styles.formContactItem}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <div>
                  <strong>Email</strong>
                  <p><a href="mailto:sanketdongare89@gmail.com">sanketdongare89@gmail.com</a></p>
                </div>
              </div>
              <div className={styles.formContactItem}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <div>
                  <strong>Phone</strong>
                  <p>+91 70837 01098</p>
                </div>
              </div>
              <div className={styles.formContactItem}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <div>
                  <strong>Location</strong>
                  <p>Cafe MH 14, Chakan, Pune-Nashik Highway</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.formCard} glass`}>
            {submitted && (
              <div className={styles.formSuccess}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Thank you! Your enquiry has been sent. We&apos;ll respond within 24 hours.
              </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="gift-name">Your Name *</label>
                  <input id="gift-name" type="text" required placeholder="Sanket Dongare"
                    value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="gift-company">Company Name *</label>
                  <input id="gift-company" type="text" required placeholder="Acme Corp Ltd."
                    value={form.company} onChange={(e) => setForm(p => ({ ...p, company: e.target.value }))} />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="gift-email">Work Email *</label>
                <input id="gift-email" type="email" required placeholder="sanket@company.com"
                  value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="gift-product">Product of Interest</label>
                  <select id="gift-product" value={form.selection}
                    onChange={(e) => setForm(p => ({ ...p, selection: e.target.value }))}>
                    <option value="box">Curated Gift Box</option>
                    <option value="bottle">Branded Water Bottles</option>
                    <option value="mug">Branded Ceramic Mugs</option>
                    <option value="keychain">Logo Keychains</option>
                    <option value="beans">Coffee Bean Gift Packs</option>
                    <option value="custom">Custom Bundle</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="gift-qty">Quantity Needed</label>
                  <input id="gift-qty" type="number" min="1" placeholder="e.g. 50"
                    value={form.quantity} onChange={(e) => setForm(p => ({ ...p, quantity: e.target.value }))} />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="gift-details">Additional Details</label>
                <textarea id="gift-details" rows={4} placeholder="Custom branding requirements, delivery dates, budget range, etc."
                  value={form.details} onChange={(e) => setForm(p => ({ ...p, details: e.target.value }))} />
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

      {/* CTA to Merchandise */}
      <section className={styles.ctaBanner}>
        <h2>Want to Browse Our Full Retail Range?</h2>
        <p>Explore our coffee beans, merchandise, and gourmet siders available for individual purchase.</p>
        <Link href="/merchandise">
          <button className="btn-primary">
            Browse Merchandise
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </Link>
      </section>
    </div>
  );
}
