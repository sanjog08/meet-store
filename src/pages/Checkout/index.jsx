import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Lock, CreditCard, MapPin } from 'lucide-react';
import { useCartStore, selectCartItems, selectTotalPrice } from '@store/cartStore';
import { useAuthStore, selectIsAuthenticated } from '@store/authStore';
import { formatCurrency } from '@utils/formatters';
import { ROUTES, SHIPPING } from '@utils/constants';
import Button from '@components/ui/Button/Button';
import styles from './Checkout.module.css';

const Checkout = () => {
  const items = useCartStore(selectCartItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const shippingCost = totalPrice > SHIPPING.FREE_ABOVE ? 0 : SHIPPING.FLAT_FEE;

  if (items.length === 0) {
    return (
      <div className={`${styles.empty} container`}>
        <ShoppingBag size={64} strokeWidth={1} />
        <h1>Nothing to checkout</h1>
        <p>Add items to your cart before checking out.</p>
        <Link to={ROUTES.PRODUCTS}>
          <Button size="lg" id="checkout-browse-btn">Browse Products <ArrowRight size={18} /></Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={`${styles.page} container`}>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.layout}>
        {/* Left — Forms */}
        <div className={styles.forms}>
          {/* Shipping */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <MapPin size={18} />
              <h2>Shipping Address</h2>
            </div>
            <div className={styles.placeholderNotice}>
              <Lock size={14} />
              <span>Shipping address form will be enabled once the orders API is live.</span>
            </div>
            <div className={styles.mockFields}>
              <div className={styles.mockField}><span>Full Name</span><div className={styles.mockInput} /></div>
              <div className={styles.mockField}><span>Address Line 1</span><div className={styles.mockInput} /></div>
              <div className={styles.mockRow}>
                <div className={styles.mockField}><span>City</span><div className={styles.mockInput} /></div>
                <div className={styles.mockField}><span>ZIP</span><div className={styles.mockInput} /></div>
              </div>
              <div className={styles.mockField}><span>Country</span><div className={styles.mockInput} /></div>
            </div>
          </div>

          {/* Payment */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <CreditCard size={18} />
              <h2>Payment Details</h2>
            </div>
            <div className={styles.placeholderNotice}>
              <Lock size={14} />
              <span>Payment integration will be enabled once the orders API is live.</span>
            </div>
            <div className={styles.mockFields}>
              <div className={styles.mockField}><span>Card Number</span><div className={styles.mockInput} /></div>
              <div className={styles.mockRow}>
                <div className={styles.mockField}><span>Expiry</span><div className={styles.mockInput} /></div>
                <div className={styles.mockField}><span>CVV</span><div className={styles.mockInput} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.summaryItems}>
            {items.map(({ product, quantity }) => (
              <div key={product._id} className={styles.summaryItem}>
                <img
                  src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/60/60`}
                  alt={product.name}
                  className={styles.summaryImage}
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${product._id}/60/60`; }}
                />
                <div className={styles.summaryItemInfo}>
                  <p className={styles.summaryItemName}>{product.name}</p>
                  <p className={styles.summaryItemQty}>Qty: {quantity}</p>
                </div>
                <p className={styles.summaryItemPrice}>{formatCurrency(product.price * quantity)}</p>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping</span>
              <span className={shippingCost === 0 ? styles.free : ''}>
                {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
              </span>
            </div>
            <div className={styles.divider} />
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total</span>
              <span>{formatCurrency(totalPrice + shippingCost)}</span>
            </div>
          </div>

          <Button
            fullWidth
            size="lg"
            disabled
            id="checkout-place-order-btn"
            title="Order placement coming soon"
          >
            <Lock size={16} />
            Place Order (Coming Soon)
          </Button>

          {!isAuthenticated && (
            <p className={styles.loginNote}>
              <Link to={ROUTES.LOGIN}>Sign in</Link> for a faster checkout experience.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
