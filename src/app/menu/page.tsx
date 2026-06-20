'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import styles from './menu.module.css';
import { MenuItem, OrderItem, formatPrice } from '@/lib/types';

export default function MenuPage() {
  const router = useRouter();
  
  // Data State
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Cart State
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  // Razorpay Mock Modal State
  const [showMockRazorpay, setShowMockRazorpay] = useState(false);
  const [mockOrderDetails, setMockOrderDetails] = useState<{
    id: string;
    amount: number;
    currency: string;
  } | null>(null);

  // Customization Modal State
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [modalOptions, setModalOptions] = useState<Record<string, string>>({});

  // Fetch Menu on Mount
  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch('/api/menu');
        if (res.ok) {
          const data = await res.json();
          setMenu(data);
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  // Filter Categories
  const categories = ['All', ...Array.from(new Set(menu.map((item) => item.category)))];

  const filteredMenu = menu.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory && item.available;
  });

  // Start Item Customization Flow
  const handleAddToCartClick = (item: MenuItem) => {
    if (item.options && item.options.length > 0) {
      // Set default options
      const defaults: Record<string, string> = {};
      item.options.forEach((opt) => {
        if (opt.choices && opt.choices.length > 0) {
          defaults[opt.name] = opt.choices[0].name;
        }
      });
      setModalOptions(defaults);
      setCustomizingItem(item);
    } else {
      // Add directly to cart
      addDirectToCart(item, {}, item.price);
    }
  };

  // Direct Add (without options or after options selected)
  const addDirectToCart = (item: MenuItem, selectedOptions: Record<string, string>, finalUnitPrice: number) => {
    setCart((prevCart) => {
      // Match existing item with identical options
      const existingIdx = prevCart.findIndex(
        (cartItem) =>
          cartItem.menuItemId === item.id &&
          JSON.stringify(cartItem.selectedOptions) === JSON.stringify(selectedOptions)
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        const newItem: OrderItem = {
          id: Math.random().toString(36).substring(2, 9),
          menuItemId: item.id,
          name: item.name,
          quantity: 1,
          selectedOptions,
          price: finalUnitPrice
        };
        return [...prevCart, newItem];
      }
    });
  };

  // Modal Customization Price Calculation
  const getCustomizingItemPrice = () => {
    if (!customizingItem) return 0;
    let price = customizingItem.price;
    
    // Add option modifiers
    customizingItem.options.forEach((opt) => {
      const selectedChoiceName = modalOptions[opt.name];
      const choice = opt.choices.find((c) => c.name === selectedChoiceName);
      if (choice) {
        price += choice.priceModifier;
      }
    });
    
    return parseFloat(price.toFixed(2));
  };

  // Complete Customization Modal and Add to Cart
  const handleConfirmCustomization = () => {
    if (!customizingItem) return;
    const finalPrice = getCustomizingItemPrice();
    addDirectToCart(customizingItem, modalOptions, finalPrice);
    setCustomizingItem(null);
  };

  // Quantity adjustments
  const updateQty = (id: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Summary Calcs
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = cartSubtotal * 0.08;
  const cartTotal = cartSubtotal + tax;

  const completeFinalOrder = async (paymentDetails?: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature?: string;
  }) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName,
          items: cart,
          notes: notes.trim() || undefined,
          razorpayOrderId: paymentDetails?.razorpayOrderId,
          razorpayPaymentId: paymentDetails?.razorpayPaymentId,
          razorpaySignature: paymentDetails?.razorpaySignature
        })
      });

      if (response.ok) {
        const order = await response.json();
        // Clear state
        setCart([]);
        setCustomerName('');
        setNotes('');
        setShowMockRazorpay(false);
        setMockOrderDetails(null);
        // Redirect to tracking page
        router.push(`/track?id=${order.id}`);
      } else {
        const errData = await response.json();
        alert(errData.error || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Network error. Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Checkout Placement
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Please enter your name for the order.');
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    setPlacingOrder(true);

    try {
      const payOrderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cart
        })
      });

      if (!payOrderResponse.ok) {
        const errData = await payOrderResponse.json();
        alert(errData.error || 'Failed to initialize payment gateway.');
        setPlacingOrder(false);
        return;
      }

      const payOrderData = await payOrderResponse.json();
      const { id: razorpayOrderId, amount, currency, key, isMock } = payOrderData;

      if (isMock) {
        // Open simulated mock payment dialog
        setMockOrderDetails({ id: razorpayOrderId, amount, currency });
        setShowMockRazorpay(true);
        return;
      }

      // Real Razorpay modal configuration
      const options = {
        key,
        amount,
        currency,
        name: 'Cafe MH 14',
        description: 'Cafe MH 14 Order Payment',
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          await completeFinalOrder({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });
        },
        prefill: {
          name: customerName,
        },
        theme: {
          color: '#d97706'
        },
        modal: {
          ondismiss: function() {
            setPlacingOrder(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Network error. Failed to initiate payment gateway.');
      setPlacingOrder(false);
    }
  };

  return (
    <div className="animate-fade">
      <div className={styles.menuContainer}>
        {/* Menu Catalog Section */}
        <section className={styles.catalogSection}>
          <div className={styles.searchFilterBar}>
            {/* Categories */}
            <div className={styles.categoriesList}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`${styles.categoryBtn} ${
                    activeCategory === cat ? styles.categoryBtnActive : ''
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Search Input */}
            <div className={styles.searchWrapper}>
              <svg
                className={styles.searchIcon}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading artisanal menu...
            </div>
          ) : filteredMenu.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No items match your search.
            </div>
          ) : (
            <div className={styles.menuGrid}>
              {filteredMenu.map((item) => (
                <div key={item.id} className={`${styles.menuItemCard} glass glass-hover`}>
                  <div
                    className={styles.itemImage}
                    style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    <span className={styles.itemImageAbbr}>
                      {item.name.split(' ').map((w) => w[0]).join('')}
                    </span>
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                    </div>
                    <p className={styles.itemDesc}>{item.description}</p>
                    <div className={styles.itemFooter}>
                      <span className={styles.itemCategory}>{item.category}</span>
                      <button
                        onClick={() => handleAddToCartClick(item)}
                        className={styles.addBtnSmall}
                      >
                        {item.options && item.options.length > 0 ? 'Customize' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sticky Cart Sidebar */}
        <aside className={`${styles.cartSidebar} glass`}>
          <div className={styles.cartHeader}>
            <h2>Order Details</h2>
            <div className={styles.cartCountBadge}>
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
          </div>

          {cart.length === 0 ? (
            <div className={styles.cartEmpty}>
              <svg
                width="40"
                height="40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <p>Your cart is empty</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Add items to begin checkout</p>
            </div>
          ) : (
            <>
              <ul className={styles.cartItemsList}>
                {cart.map((item) => (
                  <li key={item.id} className={styles.cartItem}>
                    <div className={styles.cartItemInfo}>
                      <h4 className={styles.cartItemName}>{item.name}</h4>
                      {Object.keys(item.selectedOptions).length > 0 && (
                        <div className={styles.cartItemOpts}>
                          {Object.entries(item.selectedOptions).map(([opt, choice]) => (
                            <span key={opt} className={styles.itemCategory}>
                              {opt}: {choice}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className={styles.cartItemQtyControl}>
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className={styles.qtyBtn}
                        >
                          -
                        </button>
                        <span className={styles.qtyText}>{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className={styles.qtyBtn}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className={styles.cartItemPriceBlock}>
                      <span className={styles.cartItemPrice}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={styles.removeBtn}
                      >
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.34 9m-4.78 0L9 9m12 6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles.cartSummary}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>VAT (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>

                <form onSubmit={handleCheckout} className={styles.checkoutForm}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="customerName">Your Name</label>
                    <input
                      id="customerName"
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="notes">Special Notes</label>
                    <input
                      id="notes"
                      type="text"
                      placeholder="e.g. Extra hot, extra saffron"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className={styles.inputField}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  >
                    {placingOrder ? 'Sending Order...' : 'Place Order'}
                  </button>
                </form>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Customization Modal */}
      {customizingItem && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass`}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div>
                <h2>Customize</h2>
                <h3 className="text-gradient-gold" style={{ fontSize: '1.1rem', marginTop: '0.15rem' }}>
                  {customizingItem.name}
                </h3>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className={styles.modalCloseBtn}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              {/* Item Info Summary */}
              <div className={styles.itemSummary}>
                <div
                  className={styles.itemSummaryImage}
                  style={{ backgroundImage: `url(${customizingItem.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {customizingItem.name.split(' ').map((w) => w[0]).join('')}
                </div>
                <div className={styles.itemSummaryDetails}>
                  <span className={styles.itemCategory}>{customizingItem.category}</span>
                  <p>{customizingItem.description}</p>
                </div>
              </div>

              {/* Option Selectors */}
              {customizingItem.options.map((opt) => (
                <div key={opt.name} className={styles.optionSection}>
                  <h4 className={styles.optionTitle}>{opt.name}</h4>
                  <div className={styles.choiceGrid}>
                    {opt.choices.map((choice) => {
                      const isSelected = modalOptions[opt.name] === choice.name;
                      return (
                        <div
                          key={choice.name}
                          onClick={() =>
                            setModalOptions((prev) => ({
                              ...prev,
                              [opt.name]: choice.name
                            }))
                          }
                          className={`${styles.choiceCard} ${
                            isSelected ? styles.choiceCardActive : ''
                          }`}
                        >
                          <span className={styles.choiceLabel}>{choice.name}</span>
                          <span className={styles.choicePrice}>
                            {choice.priceModifier === 0
                              ? 'Free'
                              : choice.priceModifier > 0
                              ? `+${formatPrice(choice.priceModifier)}`
                              : `-${formatPrice(Math.abs(choice.priceModifier))}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className={styles.modalFooter}>
              <div className={styles.modalPriceDisplay}>
                <span className={styles.modalPriceLabel}>Unit Price</span>
                <span className={styles.modalPriceAmount}>
                  {formatPrice(getCustomizingItemPrice())}
                </span>
              </div>
              <button
                onClick={handleConfirmCustomization}
                className="btn-primary"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mock Razorpay Payment Simulator Modal */}
      {showMockRazorpay && mockOrderDetails && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.mockPayContent}`}>
            <div className={styles.mockPayHeader}>
              <div className={styles.mockPayLogo}>
                <span className={styles.mockPayTitle}>razorpay</span>
                <span className={styles.mockPaySubTitle}>SIMULATOR</span>
              </div>
              <div className={styles.mockPayStatusLabel}>Sandbox Mode</div>
            </div>
            
            <div className={styles.mockPayBody}>
              <div className={styles.mockPayAmountCard}>
                <span className={styles.mockPayAmountLabel}>Paying To</span>
                <span className={styles.mockPayMerchant}>Cafe MH 14</span>
                <div className={styles.mockPayDivider}></div>
                <div className={styles.mockPayFlex}>
                  <div>
                    <span className={styles.mockPayAmountLabel}>Amount</span>
                    <div className={styles.mockPayTotalValue}>
                      ₹{Math.round(mockOrderDetails.amount / 100)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={styles.mockPayAmountLabel}>Order ID</span>
                    <div className={styles.mockPayOrderIdVal}>
                      {mockOrderDetails.id}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.mockPayInfoAlert}>
                This is a simulated Razorpay checkout environment. No real funds will be processed.
              </div>

              <div className={styles.mockPayActionButtons}>
                <button
                  type="button"
                  onClick={() => {
                    const mockPaymentId = `mock_pay_${Math.random().toString(36).substring(2, 10)}`;
                    completeFinalOrder({
                      razorpayOrderId: mockOrderDetails.id,
                      razorpayPaymentId: mockPaymentId
                    });
                  }}
                  className={styles.mockPayBtnSuccess}
                >
                  Simulate Success
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    alert('Simulated payment failure.');
                    setShowMockRazorpay(false);
                    setPlacingOrder(false);
                    setMockOrderDetails(null);
                  }}
                  className={styles.mockPayBtnFailure}
                >
                  Simulate Failure
                </button>
              </div>
            </div>
            
            <div className={styles.mockPayFooter}>
              <button
                type="button"
                onClick={() => {
                  setShowMockRazorpay(false);
                  setPlacingOrder(false);
                  setMockOrderDetails(null);
                }}
                className={styles.mockPayBtnCancel}
              >
                Cancel payment flow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </div>
  );
}
