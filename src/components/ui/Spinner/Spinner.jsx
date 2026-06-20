import styles from './Spinner.module.css';

/**
 * Loading spinner.
 * @param {'sm'|'md'|'lg'|'xl'} size
 * @param {string} color - CSS color value (default: brand primary)
 */
const Spinner = ({ size = 'md', color, className = '' }) => (
  <span
    className={`${styles.spinner} ${styles[size]} ${className}`}
    style={color ? { borderTopColor: color } : undefined}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;
