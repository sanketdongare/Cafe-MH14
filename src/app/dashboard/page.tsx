'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import { Order, MenuItem, formatPrice } from '@/lib/types';

const GRADIENTS = [
  'linear-gradient(135deg, #d97706, #78350f)', // Saffron Saffron
  'linear-gradient(135deg, #3b2214, #1c0d02)', // Dark Espresso
  'linear-gradient(135deg, #10b981, #065f46)', // Matcha/Kulfi Green
  'linear-gradient(135deg, #ec4899, #85144b)', // Rose Pink
  'linear-gradient(135deg, #f59e0b, #b45309)', // Mango Amber
  'linear-gradient(135deg, #3b82f6, #1d4ed8)', // Cool Blue
];

export default function DashboardPage() {
  const router = useRouter();
  
  // Auth State
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Data State
  const [activeTab, setActiveTab] = useState<'orders' | 'history' | 'reservations' | 'inventory' | 'menu' | 'analytics'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  // New States
  const [reservations, setReservations] = useState<any[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(true);

  // Add Menu Item Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Coffee');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemGradient, setNewItemGradient] = useState(GRADIENTS[0]);
  const [submittingItem, setSubmittingItem] = useState(false);

  // Image Upload State
  const [newItemImageFile, setNewItemImageFile] = useState<File | null>(null);
  const [newItemImagePreview, setNewItemImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth Guard Verification
  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch('/api/auth');
        const data = await res.json();
        if (!data.authenticated) {
          router.push('/login');
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        console.error('Session verification error:', err);
        router.push('/login');
      }
    }
    verifyAuth();
  }, [router]);

  // Poll orders & fetch menu items (only active if authenticated)
  useEffect(() => {
    if (checkingAuth) return;

    async function loadInitialData() {
      try {
        const menuRes = await fetch('/api/menu');
        if (menuRes.ok) {
          const menuData = await menuRes.json();
          setMenu(menuData);
        }
        
        // Fetch Reservations
        const resRes = await fetch('/api/reservations');
        if (resRes.ok) {
          const resData = await resRes.json();
          setReservations(resData);
        }
        setLoadingReservations(false);

        // Fetch Inventory
        const invRes = await fetch('/api/inventory');
        if (invRes.ok) {
          const invData = await invRes.json();
          setInventory(invData);
        }
        setLoadingInventory(false);
      } catch (err) {
        console.error('Error fetching initial dashboard data:', err);
      }
    }
    
    loadInitialData();
  }, [checkingAuth]);

  useEffect(() => {
    if (checkingAuth) return;

    let isMounted = true;

    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok && isMounted) {
          const data = await res.json();
          // Sort orders: newest first
          const sorted = data.sort(
            (a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(sorted);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    }

    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [checkingAuth]);

  // Compute Analytics
  const completedOrders = orders.filter((o) => o.status === 'Completed');
  const activeOrders = orders.filter((o) => ['Received', 'Preparing', 'Ready'].includes(o.status));
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const itemsSold = completedOrders.reduce((sum, o) => {
    return sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  // Logout Trigger
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth', { method: 'DELETE' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Calculate order age string (e.g. "Placed 4m ago")
  const getOrderAgeString = (createdAt: string) => {
    const elapsedMs = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(elapsedMs / 60000);
    if (mins < 1) return 'Placed just now';
    if (mins === 1) return 'Placed 1m ago';
    return `Placed ${mins}m ago`;
  };

  // Status progression action handler
  const handleUpdateStatus = async (orderId: string, currentStatus: Order['status']) => {
    let nextStatus: Order['status'] = 'Completed';
    if (currentStatus === 'Received') nextStatus = 'Preparing';
    else if (currentStatus === 'Preparing') nextStatus = 'Ready';
    else if (currentStatus === 'Ready') nextStatus = 'Completed';

    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: orderId, status: nextStatus })
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: updatedOrder.status } : o))
        );
      }
    } catch (err) {
      console.error('Error advancing status:', err);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: orderId, status: 'Cancelled' })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o))
        );
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  // Reservation status update handler
  const handleUpdateReservationStatus = async (resId: string, nextStatus: string) => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: resId, status: nextStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReservations((prev) =>
          prev.map((r) => (r.id === resId ? updated : r))
        );
      }
    } catch (err) {
      console.error('Error updating reservation:', err);
    }
  };

  // Inventory stock update handler
  const handleUpdateStock = async (itemId: string, newStock: number) => {
    if (newStock < 0) return;
    try {
      const res = await fetch('/api/inventory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: itemId, stock: newStock }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInventory((prev) =>
          prev.map((item) => (item.id === itemId ? updated : item))
        );
      }
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  // Toggle item availability
  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: item.id,
          updatedFields: { available: !item.available }
        })
      });
      if (res.ok) {
        const updatedItem = await res.json();
        setMenu((prev) => prev.map((m) => (m.id === item.id ? updatedItem : m)));
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  // Handle image file selection
  const handleImageSelect = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please use JPEG, PNG, WebP, GIF, or SVG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }
    setNewItemImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setNewItemImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setNewItemImageFile(null);
    setNewItemImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Upload image to server
  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingImage(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
      return null;
    } catch {
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Create new menu item
  const handleAddMenuItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice || !newItemCategory) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmittingItem(true);
    try {
      let imageValue = newItemGradient;

      // If an image file was selected, upload it first
      if (newItemImageFile) {
        const uploadedUrl = await uploadImage(newItemImageFile);
        if (uploadedUrl) {
          imageValue = uploadedUrl;
        } else {
          alert('Failed to upload image. Using gradient instead.');
        }
      }

      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newItemName.trim(),
          price: parseFloat(newItemPrice),
          category: newItemCategory,
          description: newItemDesc.trim(),
          image: imageValue,
          available: true
        })
      });

      if (response.ok) {
        const addedItem = await response.json();
        setMenu((prev) => [...prev, addedItem]);
        // Reset fields
        setNewItemName('');
        setNewItemPrice('');
        setNewItemDesc('');
        handleRemoveImage();
      } else {
        alert('Failed to add item to menu.');
      }
    } catch (err) {
      console.error('Error adding menu item:', err);
    } finally {
      setSubmittingItem(false);
    }
  };

  // Low Stock Items
  const lowStockItems = inventory.filter((item) => item.stock <= item.minStock);

  // Sales breakdown by menu item
  const salesBreakdown: Record<string, { name: string; quantity: number; revenue: number }> = {};
  completedOrders.forEach((o) => {
    o.items.forEach((item) => {
      if (!salesBreakdown[item.menuItemId]) {
        salesBreakdown[item.menuItemId] = { name: item.name, quantity: 0, revenue: 0 };
      }
      salesBreakdown[item.menuItemId].quantity += item.quantity;
      salesBreakdown[item.menuItemId].revenue += item.price * item.quantity;
    });
  });

  const sortedSalesBreakdown = Object.values(salesBreakdown).sort((a, b) => b.quantity - a.quantity);

  if (checkingAuth) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 2rem', color: 'var(--text-muted)' }}>
        Verifying security clearance...
      </div>
    );
  }

  return (
    <div className={`${styles.dashboardContainer} animate-fade`}>
      {/* Dashboard Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h2>Staff Operations</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Live Queue &bull; Analytics &bull; Persistent Menu Database
          </p>
        </div>

        {/* Tab Selection & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className={styles.tabsContainer}>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.tabBtnActive : ''}`}
            >
              Live Queue ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`${styles.tabBtn} ${activeTab === 'history' ? styles.tabBtnActive : ''}`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`${styles.tabBtn} ${activeTab === 'reservations' ? styles.tabBtnActive : ''}`}
            >
              Bookings ({reservations.filter((r) => r.status === 'Pending').length})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`${styles.tabBtn} ${activeTab === 'inventory' ? styles.tabBtnActive : ''}`}
            >
              Inventory {lowStockItems.length > 0 && '(⚠️)'}
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`${styles.tabBtn} ${activeTab === 'menu' ? styles.tabBtnActive : ''}`}
            >
              Menu Manager
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${styles.tabBtn} ${activeTab === 'analytics' ? styles.tabBtnActive : ''}`}
            >
              Analytics
            </button>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockItems.length > 0 && (
        <div className={styles.alertBanner}>
          <span className={styles.alertIcon}>⚠️</span>
          <div className={styles.alertText}>
            <strong>Low-Stock Warning:</strong> The following ingredients have dropped below critical thresholds:{' '}
            {lowStockItems.map((item) => `${item.name} (${item.stock} ${item.unit} remaining)`).join(', ')}.
          </div>
        </div>
      )}

      {/* RENDER ACTIVE ORDERS TAB */}
      {activeTab === 'orders' && (
        <div>
          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading live queue...
            </div>
          ) : activeOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }} className="glass">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Queue Cleared</h3>
              <p>No active orders currently waiting. You are all caught up!</p>
            </div>
          ) : (
            <div className={styles.ordersQueue}>
              {activeOrders.map((order) => (
                <div key={order.id} className={`${styles.orderCard} glass`}>
                  <div className={styles.orderCardHeader}>
                    <span className={styles.orderId}>{order.id}</span>
                    <span className={styles.orderAge}>{getOrderAgeString(order.createdAt)}</span>
                  </div>

                  <div className={styles.orderCardBody}>
                    <div className={styles.customerName}>{order.customerName}</div>
                    
                    <ul className={styles.orderItemsList}>
                      {order.items.map((item) => (
                        <li key={item.id} className={styles.orderItemRow}>
                          <div className={styles.orderItemDetails}>
                            <div>
                              <span className={styles.orderItemName}>{item.name}</span>
                              <span className={styles.orderItemQty}>x{item.quantity}</span>
                            </div>
                            {Object.keys(item.selectedOptions).length > 0 && (
                              <div className={styles.orderItemOpts}>
                                {Object.entries(item.selectedOptions).map(([opt, choice]) => (
                                  <span key={opt} style={{ color: 'var(--text-muted)' }}>
                                    {opt}: {choice}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>

                    {order.notes && (
                      <div className={styles.orderNotes}>
                        <strong>Barista Note:</strong> &ldquo;{order.notes}&rdquo;
                      </div>
                    )}
                  </div>

                  <div className={styles.orderCardFooter}>
                    <span className={styles.orderPrice}>{formatPrice(order.total)}</span>
                    <div className={styles.orderActions}>
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className={`${styles.actionBtn} ${styles.actionBtnCancel}`}
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(order.id, order.status)}
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
                      >
                        {order.status === 'Received' && 'Start Preparing'}
                        {order.status === 'Preparing' && 'Mark Ready'}
                        {order.status === 'Ready' && 'Complete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RENDER HISTORY TAB */}
      {activeTab === 'history' && (
        <div className={styles.historyTableWrapper}>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No orders found in history.
            </div>
          ) : (
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items Ordered</th>
                  <th>Date &amp; Time</th>
                  <th>Total Price</th>
                  <th>Final Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>{o.id}</td>
                    <td>{o.customerName}</td>
                    <td>
                      {o.items.map((item) => `${item.name} (x${item.quantity})`).join(', ')}
                    </td>
                    <td>
                      {new Date(o.createdAt).toLocaleDateString()} at{' '}
                      {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(o.total)}</td>
                    <td>
                      <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* RENDER MENU MANAGER TAB */}
      {activeTab === 'menu' && (
        <div className={styles.menuManagerLayout}>
          {/* Create new menu item card */}
          <div className={`${styles.managerFormCard} glass`}>
            <h3>Add New Item</h3>
            <form onSubmit={handleAddMenuItemSubmit} className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vanilla Bean Flat White"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.inputGroup} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label>Category *</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className={styles.inputField}
                    style={{ width: '100%' }}
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="Tea">Tea</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                <div>
                  <label>Base Price (₹ INR) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    placeholder="150"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className={styles.inputField}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>



              <div className={styles.inputGroup}>
                <label>Description</label>
                <textarea
                  placeholder="Describe your artisan preparation..."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className={styles.inputField}
                  rows={3}
                  style={{ resize: 'none' }}
                />
              </div>

              {/* Image Upload Section */}
              <div className={styles.inputGroup}>
                <label>Item Image</label>
                <div
                  className={styles.imageUploadZone}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add(styles.imageUploadZoneDragOver); }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove(styles.imageUploadZoneDragOver); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(styles.imageUploadZoneDragOver);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleImageSelect(file);
                  }}
                >
                  {newItemImagePreview ? (
                    <div className={styles.imagePreviewContainer}>
                      <img src={newItemImagePreview} alt="Preview" className={styles.imagePreview} />
                      <button
                        type="button"
                        className={styles.imageRemoveBtn}
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                        title="Remove image"
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className={styles.imageUploadPlaceholder}>
                      <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Zm16.5-13.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                      </svg>
                      <span>Click or drag & drop an image</span>
                      <span className={styles.imageUploadHint}>JPEG, PNG, WebP, GIF — max 5MB</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageSelect(file);
                    }}
                  />
                </div>
              </div>

              {/* Fallback: Gradient (used if no image uploaded) */}
              <div className={styles.inputGroup}>
                <label>Color Theme {newItemImagePreview ? <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(overridden by image)</span> : <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(fallback if no image)</span>}</label>
                <div className={styles.gradientPreviewList}>
                  {GRADIENTS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setNewItemGradient(g)}
                      className={`${styles.gradientPreviewBtn} ${
                        newItemGradient === g ? styles.gradientPreviewBtnActive : ''
                      }`}
                      style={{ background: g, opacity: newItemImagePreview ? 0.4 : 1 }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingItem || uploadingImage}
                className="btn-primary"
                style={{ marginTop: '0.5rem', justifyContent: 'center' }}
              >
                {uploadingImage ? 'Uploading Image...' : submittingItem ? 'Adding to Menu...' : 'Add Item'}
              </button>
            </form>
          </div>

          {/* Current menu list */}
          <div className={`${styles.managerFormCard} glass`}>
            <h3>Active Menu Inventory</h3>
            <div className={styles.managerMenuGrid}>
              {menu.map((item) => (
                <div key={item.id} className={`${styles.managerItemCard} glass`}>
                  <div
                    className={styles.managerItemImg}
                    style={{
                      background: item.image.startsWith('/') || item.image.startsWith('http')
                        ? `url(${item.image}) center/cover no-repeat`
                        : item.image
                    }}
                  >
                    {!(item.image.startsWith('/') || item.image.startsWith('http')) && item.name.split(' ').map((w) => w[0]).join('')}
                  </div>
                  <div className={styles.managerItemInfo}>
                    <div className={styles.managerItemName}>{item.name}</div>
                    <div className={styles.managerItemPrice}>
                      {formatPrice(item.price)} &middot; <span style={{ color: 'var(--text-muted)' }}>{item.category}</span>
                    </div>
                  </div>
                  <div className={styles.managerItemActions}>
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      title={item.available ? 'Mark Unavailable' : 'Mark Available'}
                      className={styles.managerIconBtn}
                      style={{ color: item.available ? 'var(--status-ready)' : 'var(--text-muted)' }}
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* RENDER RESERVATIONS TAB */}
      {activeTab === 'reservations' && (
        <div>
          {loadingReservations ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading bookings...
            </div>
          ) : reservations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }} className="glass">
              No reservations found.
            </div>
          ) : (
            <div className={styles.historyTableWrapper}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Customer Details</th>
                    <th>Date &amp; Time</th>
                    <th>Guests</th>
                    <th>Requests</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>{r.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.customerName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.email}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.phone}</div>
                      </td>
                      <td>
                        <div>{new Date(r.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>at {r.time}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{r.guests} Guests</td>
                      <td style={{ fontSize: '0.82rem', maxWidth: '200px', overflowWrap: 'break-word', fontStyle: r.notes ? 'italic' : 'normal' }}>
                        {r.notes || <span style={{ color: 'var(--text-muted)' }}>None</span>}
                      </td>
                      <td>
                        <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          {r.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateReservationStatus(r.id, 'Confirmed')}
                                className="btn-primary"
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleUpdateReservationStatus(r.id, 'Cancelled')}
                                className={`${styles.actionBtn} ${styles.actionBtnCancel}`}
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {r.status === 'Confirmed' && (
                            <>
                              <button
                                onClick={() => handleUpdateReservationStatus(r.id, 'Completed')}
                                className="btn-primary"
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: '#059669', borderColor: '#059669' }}
                              >
                                Seated
                              </button>
                              <button
                                onClick={() => handleUpdateReservationStatus(r.id, 'Cancelled')}
                                className={`${styles.actionBtn} ${styles.actionBtnCancel}`}
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {['Completed', 'Cancelled'].includes(r.status) && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Closed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* RENDER INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div>
          {loadingInventory ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading inventory list...
            </div>
          ) : (
            <div className={styles.historyTableWrapper}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Ingredient Name</th>
                    <th>Stock Level</th>
                    <th>Min Limit</th>
                    <th>Unit</th>
                    <th>Status</th>
                    <th>Quick Adjustments</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => {
                    const isOutOfStock = item.stock <= 0;
                    const isLowStock = item.stock <= item.minStock && !isOutOfStock;
                    return (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 700 }}>{item.name}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="number"
                              step="any"
                              value={item.stock}
                              onChange={(e) => handleUpdateStock(item.id, parseFloat(e.target.value) || 0)}
                              className={styles.inputField}
                              style={{ width: '80px', padding: '0.3rem 0.5rem', textAlign: 'center' }}
                            />
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{item.minStock}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.unit}</td>
                        <td>
                          {isOutOfStock && (
                            <span className="badge badge-cancelled" style={{ background: '#ef4444', color: 'white' }}>
                              Out of Stock
                            </span>
                          )}
                          {isLowStock && (
                            <span className="badge badge-received" style={{ background: '#fbbf24', color: '#78350f' }}>
                              Low Stock
                            </span>
                          )}
                          {!isOutOfStock && !isLowStock && (
                            <span className="badge badge-completed" style={{ background: '#10b981', color: 'white' }}>
                              In Stock
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <button
                              onClick={() => handleUpdateStock(item.id, item.stock - 1)}
                              className="btn-secondary"
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleUpdateStock(item.id, item.stock + 1)}
                              className="btn-secondary"
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleUpdateStock(item.id, item.stock + 5)}
                              className="btn-secondary"
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                            >
                              +5
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* RENDER ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className={styles.analyticsLayout}>
          {/* Metrics summary cards */}
          <div className={styles.analyticsGrid}>
            <div className={`${styles.analyticsCard} glass`}>
              <div className={styles.analyticsIcon}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div className={styles.analyticsInfo}>
                <span className={styles.analyticsLabel}>Total Revenue</span>
                <span className={styles.analyticsValue}>{formatPrice(totalRevenue)}</span>
              </div>
            </div>

            <div className={`${styles.analyticsCard} glass`}>
              <div className={styles.analyticsIcon}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <div className={styles.analyticsInfo}>
                <span className={styles.analyticsLabel}>Brews Delivered</span>
                <span className={styles.analyticsValue}>{itemsSold} items</span>
              </div>
            </div>

            <div className={`${styles.analyticsCard} glass`}>
              <div className={styles.analyticsIcon}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div className={styles.analyticsInfo}>
                <span className={styles.analyticsLabel}>Active Orders</span>
                <span className={styles.analyticsValue}>{activeOrders.length} active</span>
              </div>
            </div>

            <div className={`${styles.analyticsCard} glass`}>
              <div className={styles.analyticsIcon}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <div className={styles.analyticsInfo}>
                <span className={styles.analyticsLabel}>Total Customers</span>
                <span className={styles.analyticsValue}>
                  {Array.from(new Set(orders.map((o) => o.customerName))).length} unique
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Sales breakdown report table */}
          <div className={`${styles.salesReportSection} glass`} style={{ marginTop: '2.5rem', padding: '2rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '1.5rem' }}>Itemized Sales Report</h3>
            {sortedSalesBreakdown.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
                No completed sales data available yet to generate a breakdown report.
              </div>
            ) : (
              <div className={styles.historyTableWrapper}>
                <table className={styles.historyTable}>
                  <thead>
                    <tr>
                      <th>Menu Item</th>
                      <th>Brews Delivered (Qty)</th>
                      <th>Gross Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSalesBreakdown.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700 }}>{item.name}</td>
                        <td style={{ fontWeight: 600 }}>{item.quantity} units</td>
                        <td style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>{formatPrice(item.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
