import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUiStore } from '@store/uiStore';
import { useCartStore, selectCartItems, selectTotalPrice } from '@store/cartStore';
import { formatCurrency } from '@utils/formatters';
import { ROUTES } from '@utils/constants';
import Button from '@components/ui/Button/Button';
import styles from './CartDrawer.module.css';

const CartDrawer = () => {
  const { isCartDrawerOpen, closeCartDrawer } = useUiStore();
  const items = useCartStore(selectCartItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const { removeItem, updateQuantity, clearCart } = useCartStore();

  return (
    <>
      {/* Backdrop */}
      {isCartDrawerOpen && (
        <div className={styles.backdrop} onClick={closeCartDrawer} />
      )}

      {/* Drawer */}
      <aside className={`${styles.drawer} ${isCartDrawerOpen ? styles.open : ''}`} aria-label="Shopping cart">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <ShoppingCart size={20} />
            <h2 className={styles.title}>Cart</h2>
            {items.length > 0 && (
              <span className={styles.count}>{items.length}</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={closeCartDrawer} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingCart size={48} strokeWidth={1} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Your cart is empty</p>
            <p className={styles.emptyText}>Add products to start shopping</p>
            <Button variant="outline" onClick={closeCartDrawer} className={styles.shopBtn}>
              <Link to={ROUTES.PRODUCTS} onClick={closeCartDrawer}>Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map(({ product, quantity }) => (
                <div key={product._id} className={styles.item}>
                  <img
                    src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/80/80`}
                    alt={product.name}
                    className={styles.itemImage}
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${product._id}/80/80`; }}
                  />
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{product.name}</p>
                    <p className={styles.itemPrice}>{formatCurrency(product.price)}</p>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(product._id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className={styles.qty}>{quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(product._id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(product._id)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.total}>
                <span>Total</span>
                <span className={styles.totalPrice}>{formatCurrency(totalPrice)}</span>
              </div>
              <Link to={ROUTES.CHECKOUT} onClick={closeCartDrawer}>
                <Button fullWidth size="lg">
                  Checkout <ArrowRight size={16} />
                </Button>
              </Link>
              <button className={styles.clearBtn} onClick={clearCart}>Clear cart</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
