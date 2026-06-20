'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

interface Review {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  photoUrl?: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal State for Image View
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        // Sort reviews: newest first
        const sorted = data.sort(
          (a: Review, b: Review) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReviews(sorted);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Maximum size is 5MB.');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !text.trim() || !rating) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      let photoUrl = '';

      // Upload file if selected
      if (selectedFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          photoUrl = uploadData.url;
        } else {
          alert('Failed to upload image. Submitting review without image.');
        }
        setUploading(false);
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorName: authorName.trim(),
          rating,
          text: text.trim(),
          photoUrl,
        }),
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        // Reset form
        setAuthorName('');
        setRating(5);
        setText('');
        handleRemoveFile();
      } else {
        alert('Failed to submit review.');
      }
    } catch (err) {
      console.error('Submit review error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Aggregated Stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage: totalReviews > 0
      ? Math.round((reviews.filter((r) => r.rating === stars).length / totalReviews) * 100)
      : 0,
  }));

  return (
    <>
      <main className={styles.main}>
        {/* Page Hero */}
        <section className={styles.heroSection}>
          <h1 className={styles.pageTitle}>Artisanal Testimonials</h1>
          <p className={styles.pageSubtitle}>
            Read honest opinions and snapshots from our beloved community, or share your own brewing experience.
          </p>
        </section>

        {/* Stats & Form Section */}
        <section className={styles.contentGrid}>
          {/* Summary Ratings Statistics */}
          <div className={styles.statsCard}>
            <div className={styles.averageBox}>
              <div className={styles.avgScore}>{averageRating || '0.0'}</div>
              <div className={styles.avgStars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.round(averageRating) ? styles.starGolden : styles.starMuted
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className={styles.totalLabel}>Based on {totalReviews} Reviews</div>
            </div>

            <div className={styles.barsList}>
              {ratingCounts.map(({ stars, count, percentage }) => (
                <div key={stars} className={styles.barRow}>
                  <span className={styles.barStarLabel}>{stars} ★</span>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className={styles.barCountLabel}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Submission Form */}
          <div className={`${styles.formCard} glass`}>
            <h2>Share Your Experience</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Your Rating *</label>
                <div className={styles.ratingInputContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`${styles.starBtn} ${
                        (hoverRating !== null ? star <= hoverRating : star <= rating)
                          ? styles.starBtnActive
                          : ''
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      title={`${star} Star${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="authorName">Your Name *</label>
                <input
                  id="authorName"
                  type="text"
                  required
                  placeholder="e.g. Rahul Kulkarni"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="reviewText">Review Details *</label>
                <textarea
                  id="reviewText"
                  required
                  rows={4}
                  placeholder="Tell us about the flavour, atmosphere, and service..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className={styles.inputField}
                  style={{ resize: 'none' }}
                />
              </div>

              {/* Photo Upload Zone */}
              <div className={styles.formGroup}>
                <label>Attach Photo (Optional)</label>
                <div
                  className={styles.uploadZone}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add(styles.uploadZoneDragOver); }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove(styles.uploadZoneDragOver); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(styles.uploadZoneDragOver);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileChange(file);
                  }}
                >
                  {previewUrl ? (
                    <div className={styles.previewContainer}>
                      <img src={previewUrl} alt="Review snapshot preview" className={styles.previewImg} />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        className={styles.removeBtn}
                        title="Remove attached photo"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m6.827 6.175-.449-.449A3 3 0 0 0 4.254 4.82L3.25 5.825a3 3 0 0 0-.83 1.95v10.5c0 .62.25 1.18.65 1.59l.45.45c.42.42.98.66 1.59.66h13.75c.61 0 1.17-.24 1.59-.66l.45-.45c.4-.41.65-.97.65-1.59v-10.5a3 3 0 0 0-.83-1.95L19.746 5.82a3 3 0 0 0-2.124-.897h-1.586a1.5 1.5 0 0 1-1.06-.44l-1.06-1.06A1.5 1.5 0 0 0 12.854 3h-1.708a1.5 1.5 0 0 0-1.06.44l-1.06 1.06a1.5 1.5 0 0 1-1.06.44H6.827Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
                      </svg>
                      <span>Click or drag a photo review here</span>
                      <span className={styles.uploadHint}>JPG, PNG, WebP — Max 5MB</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(file);
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || uploading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                {uploading ? 'Uploading Photo...' : submitting ? 'Submitting Review...' : 'Publish Testimonial'}
              </button>
            </form>
          </div>
        </section>

        {/* Reviews List */}
        <section className={styles.reviewsListSection}>
          <h2>Community Voice</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              Loading reviews feed...
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }} className="glass">
              No reviews published yet. Be the first to share!
            </div>
          ) : (
            <div className={styles.reviewsGrid}>
              {reviews.map((r) => (
                <div key={r.id} className={`${styles.reviewCard} glass`}>
                  <div className={styles.reviewCardHeader}>
                    <div>
                      <h3 className={styles.authorName}>{r.authorName}</h3>
                      <span className={styles.reviewDate}>
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className={styles.starsRow}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={i < r.rating ? styles.starGolden : styles.starMuted}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className={styles.reviewText}>&ldquo;{r.text}&rdquo;</p>

                  {r.photoUrl && (
                    <div className={styles.reviewPhotoContainer} onClick={() => setActivePhoto(r.photoUrl || null)}>
                      <img
                        src={r.photoUrl}
                        alt={`${r.authorName}'s review photo`}
                        className={styles.reviewPhoto}
                      />
                      <div className={styles.photoOverlay}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className={styles.lightbox} onClick={() => setActivePhoto(null)}>
          <button className={styles.lightboxCloseBtn}>✕</button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img src={activePhoto} alt="Review snapshot full screen" className={styles.lightboxImg} />
          </div>
        </div>
      )}
    </>
  );
}
