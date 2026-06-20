import { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * Input component supporting label, error message, and leading/trailing icons.
 *
 * Use with React Hook Form via the `ref` prop.
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      onTrailingIconClick,
      id,
      className = '',
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputWrap}>
          {LeadingIcon && (
            <span className={styles.leadingIcon}>
              <LeadingIcon size={18} />
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              styles.input,
              error ? styles.error : '',
              LeadingIcon ? styles.hasLeading : '',
              TrailingIcon ? styles.hasTrailing : '',
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
          {TrailingIcon && (
            <button
              type="button"
              className={styles.trailingIcon}
              onClick={onTrailingIconClick}
              tabIndex={onTrailingIconClick ? 0 : -1}
            >
              <TrailingIcon size={18} />
            </button>
          )}
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
        {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
