import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, Truck, Wrench, CreditCard,
  MapPin, Phone, Tag, ShoppingCart,
} from 'lucide-react';
import { useNewProducts } from '@features/products/hooks/useNewProducts';
import { useTodaysOffer } from '@features/products/hooks/useTodaysOffer';
import { useProducts } from '@features/products/hooks/useProducts';
import { useCartStore } from '@store/cartStore';
import { formatCurrency } from '@utils/formatters';
import ProductCard from '@features/products/components/ProductCard/ProductCard';
import Button from '@components/ui/Button/Button';
import { HeroCarouselSkeleton, ProductGridSkeleton } from '@components/ui/Skeleton/Skeleton';
import { ROUTES, BUSINESS, PRODUCT_UI } from '@utils/constants';
import toast from 'react-hot-toast';
import styles from './Home.module.css';

const bizFeatures = [
  { icon: Truck,       title: 'Same Day Delivery', desc: 'Expected local delivery' },
  { icon: ShieldCheck, title: 'Genuine Products',   desc: '100% authentic guaranteed' },
  { icon: Wrench,      title: 'Repair Services',    desc: 'Screen, battery & more' },
  { icon: CreditCard,  title: 'Easy EMI',           desc: 'Flexible payment options' },
];

/* ─────────────────────────────────────────────────────────────
   Hero Carousel — swipe-enabled, no arrow buttons, 5s auto-slide
───────────────────────────────────────────────────────────── */
const HeroCarousel = ({ products, label }) => {
  const [active, setActive] = useState(0);
  const [slideDir, setSlideDir] = useState(''); // 'left' | 'right' | ''
  const [sliding, setSliding] = useState(false);
  const touchStartX = useRef(null);
  const addItem = useCartStore((s) => s.addItem);
  const count = products.length;

  const goTo = useCallback((idx, dir = 'left') => {
    if (sliding || count <= 1) return;
    setSlideDir(dir);
    setSliding(true);
    setTimeout(() => {
      setActive(idx);
      setSlideDir('');
      setSliding(false);
    }, 350);
  }, [sliding, count]);

  const next = useCallback(() => goTo((active + 1) % count, 'left'), [active, count, goTo]);
  const prev = useCallback(() => goTo((active - 1 + count) % count, 'right'), [active, count, goTo]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(next, PRODUCT_UI.CAROUSEL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [next, count]);

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  if (!count) return null;

  const product = products[active];
  const imageUrl = product.images?.[0] || `https://picsum.photos/seed/${product._id}/900/600`;
  const discounted = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : null;
  const inStock = (product.quantity ?? product.stock ?? 0) > 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    toast.success(`"${product.name}" added to cart!`);
  };

  return (
    <div
      className={styles.heroCarousel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Entire carousel is a link to the product */}
      <Link
        to={`/products/${product._id}`}
        className={styles.heroTileLink}
        aria-label={`View ${product.name}`}
      />

      {/* Discount badge — top-left corner, always visible */}
      {product.discount > 0 && (
        <span className={styles.heroDiscountCorner}>
          -{product.discount}% OFF
        </span>
      )}

      {/* Background image with slide animation */}
      <div
        className={`${styles.heroBg} ${sliding ? (slideDir === 'left' ? styles.heroBgSlideLeft : styles.heroBgSlideRight) : ''}`}
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className={styles.heroBgOverlay} />

      {/* Bottom gradient for text legibility */}
      <div className={styles.heroBottomGrad} />

      {/* Content — hidden on mobile, shown on desktop */}
      <div className={`${styles.heroContent} container`}>
        <div className={`${styles.heroSlide} ${sliding ? styles.heroSlideFade : ''}`}>
          <span className={styles.heroLabel}>
            <Tag size={13} /> {label}
          </span>
          {product.category && (
            <span className={styles.heroCategory}>{product.category}</span>
          )}
          <h2 className={styles.heroProductName}>{product.name}</h2>

          <div className={styles.heroPriceRow}>
            {discounted != null ? (
              <>
                <span className={styles.heroPrice}>{formatCurrency(discounted)}</span>
                <span className={styles.heroOriginalPrice}>{formatCurrency(product.price)}</span>
              </>
            ) : (
              <span className={styles.heroPrice}>{formatCurrency(product.price)}</span>
            )}
          </div>

          {/* Add to Cart — desktop only, hidden on mobile via CSS */}
          <div className={styles.heroActions}>
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={!inStock}
              id={`hero-cart-${product._id}`}
            >
              <ShoppingCart size={16} />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main Home Component
───────────────────────────────────────────────────────────── */
const Home = () => {
  const { data: newData,   isLoading: loadingNew }   = useNewProducts();
  const { data: offerData, isLoading: loadingOffer } = useTodaysOffer();
  const { data: allData,   isLoading: loadingAll }   = useProducts({ limit: 8 });

  const newProducts   = newData?.data?.products   || [];
  const offerProducts = offerData?.data?.products || [];
  const allProducts   = allData?.data             || [];

  return (
    <div className={styles.page}>

      {/* ── 1. New Products Hero Carousel ── */}
      <section className={styles.carouselSection}>
        <div className={styles.carouselHeader}>
          <div>
            <h2 className={styles.carouselSectionTitle}>✨ Newly Added</h2>
            <p className={styles.carouselSectionSub}>Fresh arrivals, just in</p>
          </div>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="ghost" size="sm">View all <ArrowRight size={14} /></Button>
          </Link>
        </div>

        {loadingNew ? (
          <HeroCarouselSkeleton />
        ) : newProducts.length === 0 ? (
          <p className={styles.carouselEmpty}>No new products added yet.</p>
        ) : (
          <HeroCarousel products={newProducts} label="New Arrival" />
        )}
      </section>

      {/* ── 2. Business Info Strip ── */}
      <section className={`${styles.features} container`}>
        {bizFeatures.map(({ icon: Icon, title, desc }) => (
          <div key={title} className={styles.featureCard}>
            <div className={styles.featureIcon}><Icon size={22} /></div>
            <div>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDesc}>{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── 3. Today's Offer Hero Carousel ── */}
      <section className={styles.carouselSection}>
        <div className={styles.carouselHeader}>
          <div>
            <h2 className={styles.carouselSectionTitle}>🔥 Today's Offer</h2>
            <p className={styles.carouselSectionSub}>Limited deals, grab them fast</p>
          </div>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="ghost" size="sm">View all <ArrowRight size={14} /></Button>
          </Link>
        </div>

        {loadingOffer ? (
          <HeroCarouselSkeleton />
        ) : offerProducts.length === 0 ? (
          <p className={styles.carouselEmpty}>No offers available today.</p>
        ) : (
          <HeroCarousel products={offerProducts} label="Today's Offer" />
        )}
      </section>

      {/* ── 4. All Products Grid ── */}
      <section className={`${styles.productsSection} container`}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>All Products</h2>
          </div>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="ghost" size="sm">
              See All <ArrowRight size={15} />
            </Button>
          </Link>
        </div>

        {loadingAll ? (
          <ProductGridSkeleton count={8} />
        ) : allProducts.length === 0 ? (
          <p className={styles.emptyState}>No products available yet.</p>
        ) : (
          <div className={styles.productsGrid}>
            {allProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className={styles.viewAllWrap}>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="outline" size="lg" id="home-view-all-btn">
              View All Products <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── 5. Visit Us / Order Online CTA ── */}
      <section className={`${styles.cta} container`}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaContent}>
            <span className={styles.ctaBadge}><MapPin size={13} /> Barwaha, Khargone, MP</span>
            <h2 className={styles.ctaTitle}>Visit Us or Order Online</h2>
            <p className={styles.ctaText}>
              Come to our store or reach us on WhatsApp for orders, enquiries and repair services.
              Same-day delivery expected within Barwaha.
            </p>
            <div className={styles.ctaActions}>
              <a href={BUSINESS.WHATSAPP_URL} target="_blank" rel="noreferrer">
                <Button size="lg" id="cta-whatsapp-btn">
                  <Phone size={16} /> WhatsApp Order
                </Button>
              </a>
              <a href={BUSINESS.MAP_URL} target="_blank" rel="noreferrer">
                <Button variant="secondary" size="lg" id="cta-directions-btn">
                  <MapPin size={16} /> Get Directions
                </Button>
              </a>
            </div>
            <div className={styles.ctaMeta}>
              <span>Mon–Thu, Sat–Sun: 8:00 AM – 8:00 PM</span>
              <span className={styles.ctaMetaDot}>·</span>
              <span>Friday: 9:30 AM – 5:00 PM</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
