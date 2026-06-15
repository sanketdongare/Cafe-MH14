'use client';

import { useState } from 'react';
import Header from '../components/Header';
import styles from './page.module.css';

interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: string;
}

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

export default function ReservePage() {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successReservation, setSuccessReservation] = useState<Reservation | null>(null);

  // Get today's date in YYYY-MM-DD for date picker minimum limit
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !email.trim() || !phone.trim() || !date || !time || !guests) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          date,
          time,
          guests,
          notes: notes.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessReservation(data);
        // Clear fields
        setCustomerName('');
        setEmail('');
        setPhone('');
        setDate('');
        setTime('');
        setGuests(2);
        setNotes('');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to book table.');
      }
    } catch (err) {
      console.error('Reservation submit error:', err);
      alert('Network error. Failed to book table.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Page Hero */}
        <section className={styles.heroSection}>
          <h1 className={styles.pageTitle}>Artisanal Seating</h1>
          <p className={styles.pageSubtitle}>
            Reserve your table at Cafe MH 14. Gather with friends or lock in a quiet workspace with premium roasts.
          </p>
        </section>

        {/* Content Section */}
        <section className={styles.contentWrapper}>
          {successReservation ? (
            /* Success State Card */
            <div className={`${styles.successCard} glass animate-fade`}>
              <div className={styles.successIcon}>
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h2>Table Reserved Successfully!</h2>
              <p className={styles.successIntro}>
                Your reservation is placed. We have locked in your slot and will notify you via email shortly.
              </p>

              <div className={styles.receiptGrid}>
                <div className={styles.receiptRow}>
                  <strong>Booking Reference:</strong>
                  <span className={styles.highlightVal}>{successReservation.id}</span>
                </div>
                <div className={styles.receiptRow}>
                  <strong>Guest Name:</strong>
                  <span>{successReservation.customerName}</span>
                </div>
                <div className={styles.receiptRow}>
                  <strong>Date &amp; Time:</strong>
                  <span>
                    {new Date(successReservation.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    at {successReservation.time}
                  </span>
                </div>
                <div className={styles.receiptRow}>
                  <strong>Guests Count:</strong>
                  <span>{successReservation.guests} Guest{successReservation.guests > 1 ? 's' : ''}</span>
                </div>
                <div className={styles.receiptRow}>
                  <strong>Reservation Status:</strong>
                  <span className={styles.statusBadge}>{successReservation.status}</span>
                </div>
              </div>

              <div className={styles.successInstruction}>
                <p>
                  <strong>Note:</strong> We hold tables for up to 15 minutes past your reserved time slot. If you are running late, please call staff directly at <strong>+91 20 4567 8910</strong>.
                </p>
              </div>

              <button onClick={() => setSuccessReservation(null)} className="btn-primary" style={{ alignSelf: 'center', marginTop: '1rem' }}>
                Book Another Table
              </button>
            </div>
          ) : (
            /* Form Grid Split: Info Pitch & Calendar form */
            <div className={styles.formSplitLayout}>
              {/* Info Column */}
              <div className={styles.infoColumn}>
                <h2>Lounge Experience</h2>
                <p>
                  Nestled in the heart of the Pune artisanal coffee culture, Cafe MH 14 offers a premium, relaxed ambience with warm lighting and comfortable seating.
                </p>

                <div className={styles.featurePoints}>
                  <div className={styles.featurePoint}>
                    <div className={styles.featurePointIcon}>🛋️</div>
                    <div>
                      <strong>Comfort Seating</strong>
                      <p>Warm mahogany wood tables, plush lounge chairs, and direct power outlets for remote working.</p>
                    </div>
                  </div>
                  <div className={styles.featurePoint}>
                    <div className={styles.featurePointIcon}>🎶</div>
                    <div>
                      <strong>Acoustic Jazz</strong>
                      <p>Enjoy a soft, ambient acoustic soundtrack curated daily to heighten your tasting focus.</p>
                    </div>
                  </div>
                  <div className={styles.featurePoint}>
                    <div className={styles.featurePointIcon}>🍵</div>
                    <div>
                      <strong>Artisan Experience</strong>
                      <p>Dedicated barista counters showcasing pour-overs, hand-frothed filter kaapis, and baked fusions.</p>
                    </div>
                  </div>
                </div>

                <div className={styles.contactDetails}>
                  <strong>Opening Hours:</strong>
                  <p>Monday - Sunday: 08:30 AM - 11:00 PM</p>
                  <strong>Lounge Address:</strong>
                  <p>14 Highway View Plaza, Chakan-Alandi Road, Pune - 410501</p>
                </div>
              </div>

              {/* Form Column */}
              <div className={`${styles.formCard} glass`}>
                <h2>Reserve Table</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="resDate">Select Date *</label>
                      <input
                        id="resDate"
                        type="date"
                        required
                        min={getTodayDateString()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={styles.inputField}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="resTime">Select Time *</label>
                      <select
                        id="resTime"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className={styles.inputField}
                      >
                        <option value="">Choose slot...</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="resGuests">Number of Guests *</label>
                      <select
                        id="resGuests"
                        required
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className={styles.inputField}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                          <option key={num} value={num}>
                            {num} Guest{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="resName">Full Name *</label>
                      <input
                        id="resName"
                        type="text"
                        required
                        placeholder="e.g. Vikram Malhotra"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="resEmail">Email Address *</label>
                      <input
                        id="resEmail"
                        type="email"
                        required
                        placeholder="e.g. vikram@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.inputField}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="resPhone">Phone Number *</label>
                      <input
                        id="resPhone"
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="resNotes">Special Requests (Optional)</label>
                    <textarea
                      id="resNotes"
                      rows={3}
                      placeholder="Wheelchair access, window table, dietary requests, celebrating an anniversary..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className={styles.inputField}
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  >
                    {submitting ? 'Placing reservation...' : 'Confirm Table Booking'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
