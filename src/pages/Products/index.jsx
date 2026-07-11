import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '@features/products/hooks/useProducts';
import ProductCard from '@features/products/components/ProductCard/ProductCard';
import { ProductGridSkeleton } from '@components/ui/Skeleton/Skeleton';
import useDebounce from '@hooks/useDebounce';
import styles from './Products.module.css';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

const Products = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const debouncedSearch = useDebounce(search, 400);

  const params = {};
  if (debouncedSearch) params.search = debouncedSearch;
  if (selectedCategory !== 'All') params.category = selectedCategory;

  const { data, isLoading, isError, error } = useProducts(params);
  const products = data?.data || [];

  return (
    <div className={`${styles.page} container`}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Products</h1>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input
            id="products-search"
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className={styles.categories}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`category-filter-${cat.toLowerCase()}`}
              className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : isError ? (
        <div className={styles.errorState}>
          <p>Failed to load products: {error?.message}</p>
        </div>
      ) : products.length === 0 ? (
        <div className={styles.emptyState}>
          <SlidersHorizontal size={48} strokeWidth={1} />
          <p>No products found</p>
          <button onClick={() => { setSearch(''); setSelectedCategory('All'); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
