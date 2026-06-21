import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart, ArrowLeft, Star, Package, Tag,
  Shield, Percent, CheckCircle, XCircle, ChevronRight,
} from 'lucide-react';
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
  const [activeImage, setActiveImage] = useState(0);

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
        <Package size={56} strokeWidth={1} />
        <h2>Product not found</h2>
        <p>This product may have been removed or does not exist.</p>
        <Link to={ROUTES.PRODUCTS}><Button variant="outline">Back to Products</Button></Link>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : [`https://picsum.photos/seed/${product._id}/800/600`];

  const inStock = (product.quantity ?? 0) > 0;

  const discountedPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : null;

  return (
    <div className={`${styles.page} container`}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link to={ROUTES.HOME}>Home</Link>
        <ChevronRight size={14} />
        <Link to={ROUTES.PRODUCTS}>Products</Link>
        <ChevronRight size={14} />
        <span>{product.name}</span>
      </nav>

      <div className={styles.layout}>
        {/* ── Left: Image Gallery ── */}
        <div className={styles.imageSection}>
          <div className={styles.mainImageWrap}>
            <img
              key={activeImage}
              src={images[activeImage]}
              alt={product.name}
              className={styles.mainImage}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${product._id}/800/600`; }}
            />
            {product.discount > 0 && (
              <div className={styles.discountBadge}>-{product.discount}%</div>
            )}
          </div>

          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Info Panel ── */}
        <div className={styles.info}>
          {/* Badges */}
          <div className={styles.badges}>
            {product.category && <Badge variant="brand">{product.category}</Badge>}
            {product.brand && <Badge variant="default">{product.brand}</Badge>}
            {inStock
              ? <Badge variant="success"><CheckCircle size={12} /> In Stock</Badge>
              : <Badge variant="danger"><XCircle size={12} /> Out of Stock</Badge>
            }
          </div>

          <h1 className={styles.name}>{product.name}</h1>

          {/* Price */}
          <div className={styles.priceBlock}>
            {discountedPrice != null ? (
              <>
                <span className={styles.price}>{formatCurrency(discountedPrice)}</span>
                <span className={styles.originalPrice}>{formatCurrency(product.price)}</span>
                <span className={styles.saveBadge}>Save {formatCurrency(product.price - discountedPrice)}</span>
              </>
            ) : (
              <span className={styles.price}>{formatCurrency(product.price)}</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className={styles.descriptionBlock}>
              <h3 className={styles.sectionTitle}>About this product</h3>
              <p className={styles.description}>{product.description}</p>
            </div>
          )}

          {/* Meta details */}
          <div className={styles.metaGrid}>
            {product.brand && (
              <div className={styles.metaCard}>
                <Tag size={16} className={styles.metaIcon} />
                <div>
                  <span className={styles.metaLabel}>Brand</span>
                  <span className={styles.metaValue}>{product.brand}</span>
                </div>
              </div>
            )}
            <div className={styles.metaCard}>
              <Package size={16} className={styles.metaIcon} />
              <div>
                <span className={styles.metaLabel}>Stock</span>
                <span className={styles.metaValue}>{product.quantity ?? 0} units</span>
              </div>
            </div>
            {product.discount > 0 && (
              <div className={styles.metaCard}>
                <Percent size={16} className={styles.metaIcon} />
                <div>
                  <span className={styles.metaLabel}>Discount</span>
                  <span className={styles.metaValue}>{product.discount}% off</span>
                </div>
              </div>
            )}
            {product.warranty && (
              <div className={styles.metaCard}>
                <Shield size={16} className={styles.metaIcon} />
                <div>
                  <span className={styles.metaLabel}>Warranty</span>
                  <span className={styles.metaValue}>{product.warranty}</span>
                </div>
              </div>
            )}
          </div>

          {/* Added date */}
          <p className={styles.addedDate}>Listed on {formatDate(product.createdAt)}</p>

          {/* Actions */}
          <div className={styles.actions}>
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={!inStock}
              fullWidth
              id="product-detail-add-to-cart"
            >
              <ShoppingCart size={18} />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Link to={ROUTES.CHECKOUT} className={styles.checkoutLink}>
              <Button variant="secondary" size="lg" fullWidth id="product-detail-buy-now" disabled={!inStock}>
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
