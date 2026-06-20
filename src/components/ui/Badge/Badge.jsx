import styles from './Badge.module.css';

/**
 * Badge for status labels, tags, roles, etc.
 * @param {'default'|'success'|'warning'|'danger'|'info'|'brand'} variant
 * @param {'sm'|'md'} size
 */
const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => (
  <span className={`${styles.badge} ${styles[variant]} ${styles[size]} ${className}`}>
    {children}
  </span>
);

export default Badge;
