import styles from './Button.module.css';
import Spinner from '../Spinner/Spinner';

/**
 * Button component with multiple variants, sizes, and states.
 *
 * @param {'primary'|'secondary'|'ghost'|'danger'|'outline'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} isLoading
 * @param {boolean} fullWidth
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    isLoading ? styles.loading : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <span className={styles.spinnerWrap}>
          <Spinner size="sm" color="currentColor" />
        </span>
      )}
      <span className={isLoading ? styles.hiddenText : ''}>{children}</span>
    </button>
  );
};

export default Button;
