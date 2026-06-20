import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Package, Tag } from 'lucide-react';
import { useProduct } from '@features/products/hooks/useProducts';
import { useCartStore } from '@store/cartStore';
import { formatCurrency, formatDate } from '@utils/formatters';
import { ROUTES } from '@utils/constants';
import Button from '@components/ui/Button/Button';
import Badge from '@components/ui/Badge/Badge';
import Spinner from '@components/ui/Spinner/Spinner';
import toast from 'react-hot-toast';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useProduct(id);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`"${product.name}" added to cart!`);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size="xl" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className={`${styles.error} container`}>
        <Package size={48} strokeWidth={1} />
        <h2>Product not found</h2>
        <Link to={ROUTES.PRODUCTS}><Button variant="outline">Back to Products</Button></Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0] || `https://picsum.photos/seed/${product._id}/800/600`;

  return (
    <div className={`${styles.page} container`}>
      <Link to={ROUTES.PRODUCTS} className={styles.back}>
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className={styles.layout}>
        {/* Image */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img
              src={imageUrl}
              alt={product.name}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${product._id}/800/600`; }}
            />
          </div>
          {product.images?.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.slice(0, 4).map((img, i) => (
                <img key={i} src={img} alt={`${product.name} ${i + 1}`} className={styles.thumb} />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className={styles.info}>
          <div className={styles.badges}>
            {product.category && <Badge variant="brand">{product.category}</Badge>}
            {product.brand && <Badge variant="default">{product.brand}</Badge>}
            {product.stock === 0
              ? <Badge variant="danger">Out of Stock</Badge>
              : <Badge variant="success">In Stock ({product.stock})</Badge>
            }
          </div>

          <h1 className={styles.name}>{product.name}</h1>

          <div className={styles.rating}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={16} fill={s <= 4 ? 'currentColor' : 'none'} />
            ))}
            <span className={styles.ratingText}>4.0 (128 reviews)</span>
          </div>

          <p className={styles.price}>{formatCurrency(product.price)}</p>

          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}

          <div className={styles.meta}>
            {product.brand && (
              <div className={styles.metaItem}>
                <Tag size={14} />
                <span>Brand: <strong>{product.brand}</strong></span>
              </div>
            )}
            <div className={styles.metaItem}>
              <Package size={14} />
              <span>Added: <strong>{formatDate(product.createdAt)}</strong></span>
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              fullWidth
              id="product-detail-add-to-cart"
            >
              <ShoppingCart size={18} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Link to={ROUTES.CHECKOUT} className={styles.checkoutLink}>
              <Button variant="secondary" size="lg" fullWidth id="product-detail-buy-now">
                Buy Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
