'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './track.module.css';
import { Order, formatPrice } from '@/lib/types';

function TrackingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdParam = searchParams.get('id');

  const [searchId, setSearchId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Poll for order updates
  useEffect(() => {
    if (!orderIdParam) {
      setOrder(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError('');

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders?id=${orderIdParam}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Order code not found. Please verify the code.');
          } else {
            setError('An error occurred while fetching your order.');
          }
          setOrder(null);
          return;
        }
        const data = await res.json();
        if (isMounted) {
          setOrder(data);
          setError('');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        if (isMounted) setError('Network error. Retrying...');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchOrder();

    // Set up polling interval every 3 seconds
    const interval = setInterval(fetchOrder, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderIdParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    router.push(`/track?id=${searchId.trim().toUpperCase()}`);
  };

  // Helper to determine step status
  const getStepStatus = (stepName: 'Received' | 'Preparing' | 'Ready' | 'Completed') => {
    if (!order) return 'pending';
    
    if (order.status === 'Cancelled') return 'pending';

    const statusOrder = ['Received', 'Preparing', 'Ready', 'Completed'];
    const currentIdx = statusOrder.indexOf(order.status);
    const stepIdx = statusOrder.indexOf(stepName);

    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'active';
    return 'pending';
  };

  const getProgressPercentage = () => {
    if (!order || order.status === 'Cancelled') return 0;
    switch (order.status) {
      case 'Received': return 0;
      case 'Preparing': return 33;
      case 'Ready': return 66;
      case 'Completed': return 100;
      default: return 0;
    }
  };

  // Render Search Panel when no orderId is queried
  if (!orderIdParam) {
    return (
      <div className={`${styles.trackContainer} animate-fade`}>
        <div className={`${styles.searchCard} glass`}>
          <h2>Track Your Beverage</h2>
          <p>Enter the Order ID printed on your receipt or confirmation screen to watch your drink preparation live.</p>
          
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input
              type="text"
              placeholder="e.g. CF-1002"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className={styles.searchInputLarge}
              autoFocus
            />
            <button type="submit" className="btn-primary styles.searchBtn">
              Track Order
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.trackContainer} animate-fade`}>
      {/* Header Info */}
      <div className={`${styles.orderHeaderCard} glass`}>
        <div className={styles.orderHeaderLeft}>
          <h2>Order {orderIdParam.toUpperCase()}</h2>
          <p>
            Placed on:{' '}
            {order
              ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Checking...'}
          </p>
        </div>
        <div>
          {order && (
            <span
              className={`badge badge-${order.status.toLowerCase()}`}
              style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
            >
              {order.status}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.cancelledAlert} style={{ background: 'rgba(239, 68, 68, 0.04)' }}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <div>
            <h3>Look-up Failed</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Stepper Progress */}
      {order && (
        <div className={`${styles.stepperCard} glass`}>
          {order.status === 'Cancelled' ? (
            <div className={styles.cancelledAlert}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <div>
                <h3>Order Cancelled</h3>
                <p>This order has been cancelled by the staff. Please contact support or place a new order.</p>
              </div>
            </div>
          ) : (
            <div className={styles.stepperWrapper}>
              {/* Progress Connector Line */}
              <div className={styles.stepperLine}>
                <div 
                  className={styles.stepperLineProgress}
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>

              {/* Step 1: Received */}
              <div 
                className={`${styles.stepNode} ${
                  getStepStatus('Received') === 'active' 
                    ? styles.stepNodeActive 
                    : getStepStatus('Received') === 'completed'
                    ? styles.stepNodeCompleted 
                    : ''
                }`}
              >
                <div className={styles.stepCircle}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
                  </svg>
                </div>
                <span className={styles.stepLabel}>Received</span>
                <span className={styles.stepDesc}>Sent to kitchen</span>
              </div>

              {/* Step 2: Preparing */}
              <div 
                className={`${styles.stepNode} ${
                  getStepStatus('Preparing') === 'active' 
                    ? styles.stepNodeActive 
                    : getStepStatus('Preparing') === 'completed'
                    ? styles.stepNodeCompleted 
                    : ''
                }`}
              >
                <div className={styles.stepCircle}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v1.244c0 .892-.606 1.673-1.488 1.838a11.968 11.968 0 0 0-3.35 1.547c-.702.438-1.077 1.258-1.077 2.072v7.199c0 1.237 1.01 2.228 2.228 2.228h11.874c1.217 0 2.228-.99 2.228-2.228V9.864c0-.814-.375-1.634-1.077-2.072a11.967 11.967 0 0 0-3.35-1.547c-.882-.165-1.488-.946-1.488-1.838V3.104c0-.502-.408-.91-.91-.91h-3.414c-.502 0-.91.408-.91.91Z" />
                  </svg>
                </div>
                <span className={styles.stepLabel}>Preparing</span>
                <span className={styles.stepDesc}>Crafting brew</span>
              </div>

              {/* Step 3: Ready for Pickup */}
              <div 
                className={`${styles.stepNode} ${
                  getStepStatus('Ready') === 'active' 
                    ? styles.stepNodeActive 
                    : getStepStatus('Ready') === 'completed'
                    ? styles.stepNodeCompleted 
                    : ''
                }`}
              >
                <div className={styles.stepCircle}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                </div>
                <span className={styles.stepLabel}>Ready</span>
                <span className={styles.stepDesc}>Hot at counter</span>
              </div>

              {/* Step 4: Completed */}
              <div 
                className={`${styles.stepNode} ${
                  getStepStatus('Completed') === 'active' 
                    ? styles.stepNodeActive 
                    : getStepStatus('Completed') === 'completed'
                    ? styles.stepNodeCompleted 
                    : ''
                }`}
              >
                <div className={styles.stepCircle}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <span className={styles.stepLabel}>Completed</span>
                <span className={styles.stepDesc}>Enjoy your brew!</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary grid */}
      {order && (
        <div className={styles.summaryGrid}>
          {/* Items card */}
          <div className={`${styles.itemsCard} glass`}>
            <h3>Items Ordered</h3>
            <ul className={styles.itemsList}>
              {order.items.map((item) => (
                <li key={item.id} className={styles.orderItemRow}>
                  <div className={styles.orderItemDetails}>
                    <div className={styles.orderItemName}>
                      <span>{item.name}</span>
                      <span className={styles.qtyTag}>x{item.quantity}</span>
                    </div>
                    {Object.keys(item.selectedOptions).length > 0 && (
                      <div className={styles.orderItemOpts}>
                        {Object.entries(item.selectedOptions).map(([opt, choice]) => (
                          <span key={opt} className={styles.itemCategory}>
                            {opt}: {choice}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={styles.orderItemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {order.notes && (
              <div className={styles.notesBox}>
                <div className={styles.notesLabel}>Notes for Barista</div>
                <div className={styles.notesText}>&ldquo;{order.notes}&rdquo;</div>
              </div>
            )}
          </div>

          {/* Receipt details */}
          <div className={`${styles.receiptCard} glass`}>
            <h3>Receipt Summary</h3>
            <div className={styles.receiptRow}>
              <span>Subtotal</span>
              <span>{formatPrice(order.total / 1.08)}</span>
            </div>
            <div className={styles.receiptRow}>
              <span>VAT (8%)</span>
              <span>{formatPrice(order.total - order.total / 1.08)}</span>
            </div>
            <div className={styles.receiptTotalRow}>
              <span>Total paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>

            <div className={styles.metaRow}>
              <span>
                <span>Status</span>
                <span className={styles.metaVal}>{order.status}</span>
              </span>
              <span>
                <span>Name</span>
                <span className={styles.metaVal}>{order.customerName}</span>
              </span>
              <span>
                <span>Timestamp</span>
                <span className={styles.metaVal}>
                  {new Date(order.createdAt).toLocaleDateString()} at{' '}
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Loading tracking portal...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
