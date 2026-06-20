import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { useProducts } from '@features/products/hooks/useProducts';
import ProductCard from '@features/products/components/ProductCard/ProductCard';
import Button from '@components/ui/Button/Button';
import Spinner from '@components/ui/Spinner/Spinner';
import { ROUTES } from '@utils/constants';
import styles from './Home.module.css';

const features = [
  { icon: Truck,       title: 'Free Shipping',   desc: 'On all orders over $50' },
  { icon: ShieldCheck, title: 'Secure Payment',   desc: '256-bit SSL encryption' },
  { icon: RefreshCw,   title: 'Easy Returns',     desc: '30-day hassle-free returns' },
  { icon: Star,        title: 'Top Quality',      desc: 'Curated premium products' },
];

const Home = () => {
  const { data, isLoading } = useProducts({ limit: 8 });
  const products = data?.data || [];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={`${styles.heroInner} container`}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Premium Shopping Experience</span>
            <h1 className={styles.heroTitle}>
              Discover Products<br />
              <span className={styles.heroGradient}>You&apos;ll Love</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Thousands of curated products, fast delivery, and a seamless
              experience from browse to doorstep.
            </p>
            <div className={styles.heroActions}>
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" id="hero-shop-now-btn">
                  Shop Now <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button variant="secondary" size="lg" id="hero-get-started-btn">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroGlow} />
            <div className={styles.statsGrid}>
              {[
                { value: '10K+', label: 'Products' },
                { value: '50K+', label: 'Customers' },
                { value: '4.9★', label: 'Rating' },
                { value: '99%', label: 'Satisfaction' },
              ].map((stat) => (
                <div key={stat.label} className={styles.statCard}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={`${styles.features} container`}>
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Icon size={22} />
            </div>
            <div>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDesc}>{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Featured Products ── */}
      <section className={`${styles.productsSection} container`}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <p className={styles.sectionSubtitle}>Hand-picked items just for you</p>
          </div>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="ghost" size="sm">
              View all <ArrowRight size={15} />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className={styles.loadingState}>
            <Spinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <p className={styles.emptyState}>No products available yet.</p>
        ) : (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Banner ── */}
      <section className={`${styles.cta} container`}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to shop smarter?</h2>
          <p className={styles.ctaText}>
            Join thousands of happy customers. Create your free account today.
          </p>
          <Link to={ROUTES.REGISTER}>
            <Button size="lg" id="cta-register-btn">
              Get Started Free <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
