import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore, selectCartItems, selectTotalPrice } from '@store/cartStore';
import { formatCurrency } from '@utils/formatters';
import { ROUTES } from '@utils/constants';
import Button from '@components/ui/Button/Button';
import styles from './Cart.module.css';

const Cart = () => {
  const items = useCartStore(selectCartItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const { removeItem, updateQuantity, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className={`${styles.empty} container`}>
        <ShoppingCart size={64} strokeWidth={1} className={styles.emptyIcon} />
        <h1>Your cart is empty</h1>
        <p>Looks like you haven&apos;t added anything yet.</p>
        <Link to={ROUTES.PRODUCTS}>
          <Button size="lg" id="cart-browse-btn">
            Browse Products <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={`${styles.page} container`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shopping Cart</h1>
        <button className={styles.clearBtn} onClick={clearCart}>Clear all</button>
      </div>

      <div className={styles.layout}>
        <div className={styles.items}>
          {items.map(({ product, quantity }) => (
            <div key={product._id} className={styles.item}>
              <img
                src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/120/120`}
                alt={product.name}
                className={styles.image}
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${product._id}/120/120`; }}
              />
              <div className={styles.itemInfo}>
                <Link to={`/products/${product._id}`} className={styles.itemName}>{product.name}</Link>
                {product.category && <span className={styles.itemCategory}>{product.category}</span>}
                <p className={styles.itemPrice}>{formatCurrency(product.price)}</p>
              </div>
              <div className={styles.itemControls}>
                <div className={styles.quantity}>
                  <button onClick={() => updateQuantity(product._id, quantity - 1)} aria-label="Decrease"><Minus size={14} /></button>
                  <span>{quantity}</span>
                  <button onClick={() => updateQuantity(product._id, quantity + 1)} aria-label="Increase"><Plus size={14} /></button>
                </div>
                <p className={styles.subtotal}>{formatCurrency(product.price * quantity)}</p>
                <button className={styles.remove} onClick={() => removeItem(product._id)} aria-label="Remove">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.free}>{totalPrice > 50 ? 'Free' : formatCurrency(9.99)}</span>
            </div>
            <div className={styles.divider} />
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>{formatCurrency(totalPrice > 50 ? totalPrice : totalPrice + 9.99)}</span>
            </div>
          </div>
          <Link to={ROUTES.CHECKOUT}>
            <Button size="lg" fullWidth id="cart-checkout-btn">
              Proceed to Checkout <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to={ROUTES.PRODUCTS} className={styles.continueShopping}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
