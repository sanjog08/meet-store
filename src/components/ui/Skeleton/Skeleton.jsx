import styles from './Skeleton.module.css';

/**
 * Generic skeleton block — a single shimmer rectangle.
 * @param {string}  width     - CSS width (default: '100%')
 * @param {string}  height    - CSS height (default: '1rem')
 * @param {string}  radius    - CSS border-radius override
 * @param {string}  className - Additional class names
 */
export const Skeleton = ({ width = '100%', height = '1rem', radius, className = '' }) => (
  <div
    className={`skeleton ${styles.skeleton} ${className}`}
    style={{
      width,
      height,
      ...(radius ? { borderRadius: radius } : {}),
    }}
    aria-hidden="true"
  />
);

/* ── Compound skeletons ─────────────────────────────────────── */

/** Skeleton for a single ProductCard */
export const ProductCardSkeleton = () => (
  <div className={styles.productCard}>
    <div className={`skeleton ${styles.productImage}`} />
    <div className={styles.productInfo}>
      <Skeleton width="40%" height="0.7rem" />
      <Skeleton width="90%" height="1rem" />
      <Skeleton width="60%" height="0.75rem" />
      <div className={styles.productMeta}>
        <Skeleton width="40px" height="1.1rem" />
        <Skeleton width="64px" height="1.1rem" />
      </div>
    </div>
  </div>
);

/** Grid of N product card skeletons */
export const ProductGridSkeleton = ({ count = 8, className = '' }) => (
  <div className={`${styles.productGrid} ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

/** Skeleton for the hero carousel — single full-width tile */
export const HeroCarouselSkeleton = () => (
  <div className={`skeleton ${styles.heroCarousel}`} />
);

/** Full ProductDetail page skeleton */
export const ProductDetailSkeleton = () => (
  <div className={`${styles.detailPage} container`}>
    <div className={styles.detailBreadcrumb}>
      <Skeleton width="240px" height="0.875rem" />
    </div>
    <div className={styles.detailLayout}>
      {/* image side */}
      <div className={styles.detailImageSide}>
        <div className={`skeleton ${styles.detailMainImage}`} />
        <div className={styles.detailThumbs}>
          {[1, 2, 3].map((i) => <div key={i} className={`skeleton ${styles.detailThumb}`} />)}
        </div>
      </div>
      {/* info side */}
      <div className={styles.detailInfoSide}>
        <div className={styles.detailBadges}>
          <Skeleton width="72px" height="22px" radius="999px" />
          <Skeleton width="56px" height="22px" radius="999px" />
          <Skeleton width="80px" height="22px" radius="999px" />
        </div>
        <Skeleton width="85%" height="2.5rem" />
        <Skeleton width="45%" height="1.75rem" />
        <Skeleton width="100%" height="80px" />
        <div className={styles.detailMetaGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.detailMetaCard}>
              <Skeleton width="100%" height="56px" />
            </div>
          ))}
        </div>
        <Skeleton width="100%" height="48px" radius="8px" />
        <Skeleton width="100%" height="48px" radius="8px" />
      </div>
    </div>
  </div>
);

/** Skeleton for table rows (admin tables) */
export const TableSkeleton = ({ rows = 5, columns = [2, 2, 1, 1, 1] }) => (
  <div className={styles.tableWrap}>
    {/* header */}
    <div className={styles.tableSkeletonHead}>
      {columns.map((fr, i) => (
        <Skeleton key={i} width="60%" height="0.7rem" />
      ))}
    </div>
    {/* rows */}
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className={styles.tableSkeletonRow}>
        {/* first col has avatar + text */}
        <div className={styles.tableSkeletonUser}>
          <div className={`skeleton ${styles.tableSkeletonAvatar}`} />
          <div className={styles.tableSkeletonUserText}>
            <Skeleton width="80%" height="0.875rem" />
            <Skeleton width="55%" height="0.75rem" />
          </div>
        </div>
        {columns.slice(1).map((_, c) => (
          <Skeleton key={c} width="70%" height="0.875rem" />
        ))}
      </div>
    ))}
  </div>
);

/** Skeleton for the AdminRequests card list */
export const RequestCardsSkeleton = ({ count = 4 }) => (
  <div className={styles.requestList}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={styles.requestCard}>
        <div className={styles.requestCardLeft}>
          <div className={`skeleton ${styles.requestAvatar}`} />
          <div className={styles.requestText}>
            <Skeleton width="140px" height="0.9rem" />
            <Skeleton width="180px" height="0.75rem" />
            <Skeleton width="100px" height="0.7rem" />
          </div>
        </div>
        <Skeleton width="68px" height="22px" radius="999px" />
        <div className={styles.requestActions}>
          <Skeleton width="80px" height="32px" radius="6px" />
          <Skeleton width="68px" height="32px" radius="6px" />
        </div>
      </div>
    ))}
  </div>
);

/** Skeleton for AboutUs public page */
export const AboutUsSkeleton = () => (
  <div className={styles.aboutSkeleton}>
    {/* hero */}
    <div className={styles.aboutHero}>
      <div className="container">
        <Skeleton width="160px" height="28px" radius="999px" />
        <Skeleton width="70%" height="3.5rem" />
        <Skeleton width="50%" height="1.25rem" />
        <Skeleton width="85%" height="1rem" />
        <Skeleton width="75%" height="1rem" />
        <div className={styles.aboutHeroActions}>
          <Skeleton width="160px" height="44px" radius="999px" />
          <Skeleton width="140px" height="44px" radius="999px" />
        </div>
      </div>
    </div>
    {/* content */}
    <div className={`${styles.aboutContent} container`}>
      {/* highlights grid */}
      <div className={styles.aboutHighlights}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} width="100%" height="56px" radius="12px" />
        ))}
      </div>
      {/* two col */}
      <div className={styles.aboutTwoCol}>
        <div className={styles.aboutColStack}>
          <Skeleton width="60%" height="1.5rem" />
          <div className={styles.aboutTagRow}>
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} width="80px" height="28px" radius="999px" />)}
          </div>
        </div>
        <div className={styles.aboutColStack}>
          <Skeleton width="60%" height="1.5rem" />
          <div className={styles.aboutTagRow}>
            {[1, 2, 3].map((i) => <Skeleton key={i} width="80px" height="28px" radius="999px" />)}
          </div>
        </div>
      </div>
      {/* info cards */}
      <div className={styles.aboutInfoGrid}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} width="100%" height="120px" radius="16px" />
        ))}
      </div>
    </div>
  </div>
);

/** Skeleton for AdminAboutUs form */
export const AdminAboutUsSkeleton = () => (
  <div className={`${styles.adminAboutSkeleton} container`}>
    {/* header */}
    <div className={styles.adminAboutHeader}>
      <div>
        <Skeleton width="240px" height="1.875rem" />
        <Skeleton width="340px" height="0.875rem" />
      </div>
      <div className={styles.adminAboutHeaderActions}>
        <Skeleton width="80px" height="36px" radius="6px" />
        <Skeleton width="120px" height="36px" radius="6px" />
      </div>
    </div>
    {/* section cards */}
    {[240, 180, 140, 160, 160, 140, 120, 160].map((h, i) => (
      <div key={i} className={styles.adminAboutCard}>
        <Skeleton width="160px" height="1rem" />
        <Skeleton width="100%" height={`${h}px`} />
      </div>
    ))}
  </div>
);

export default Skeleton;
