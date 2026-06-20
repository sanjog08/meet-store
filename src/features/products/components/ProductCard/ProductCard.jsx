import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '@store/cartStore';
import { formatCurrency } from '@utils/formatters';
import { ROUTES } from '@utils/constants';
import Button from '@components/ui/Button/Button';
import Badge from '@components/ui/Badge/Badge';
import toast from 'react-hot-toast';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`"${product.name}" added to cart`);
  };

  const imageUrl = product.images?.[0] || `https://picsum.photos/seed/${product._id}/400/300`;
  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <Link to={`/products/${product._id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={imageUrl}
          alt={product.name}
          className={styles.image}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${product._id}/400/300`;
          }}
        />
        {isNew && <Badge variant="brand" className={styles.newBadge}>NEW</Badge>}
        {product.stock === 0 && (
          <div className={styles.outOfStock}>Out of Stock</div>
        )}
        <div className={styles.overlay}>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            id={`add-to-cart-${product._id}`}
          >
            <ShoppingCart size={15} />
            Add to Cart
          </Button>
        </div>
      </div>

      <div className={styles.info}>
        {product.category && (
          <span className={styles.category}>{product.category}</span>
        )}
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.meta}>
          <div className={styles.rating}>
            <Star size={13} fill="currentColor" />
            <span>4.5</span>
          </div>
          <p className={styles.price}>{formatCurrency(product.price)}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
