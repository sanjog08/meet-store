/**
 * Pure formatting utilities — no side effects, easily testable.
 */

/**
 * Formats a number as a currency string.
 * @param {number} amount
 * @param {string} currency - ISO 4217 currency code (default: 'USD')
 * @returns {string} e.g. '$1,299.99'
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount == null || isNaN(amount)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats an ISO date string into a readable date.
 * @param {string|Date} date
 * @returns {string} e.g. 'Jun 20, 2026'
 */
export const formatDate = (date) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Returns a relative time string like '2 hours ago'.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '—';
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = (new Date(date) - Date.now()) / 1000;

  const thresholds = [
    { unit: 'year',   value: 31536000 },
    { unit: 'month',  value: 2592000  },
    { unit: 'week',   value: 604800   },
    { unit: 'day',    value: 86400    },
    { unit: 'hour',   value: 3600     },
    { unit: 'minute', value: 60       },
    { unit: 'second', value: 1        },
  ];

  for (const { unit, value } of thresholds) {
    if (Math.abs(diff) >= value) {
      return rtf.format(Math.round(diff / value), unit);
    }
  }
  return 'just now';
};

/**
 * Truncates a string to the given length, appending '…'.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str;
  return `${str.slice(0, maxLength).trimEnd()}…`;
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Returns initials from a full name (up to 2 chars).
 * @param {string} name
 * @returns {string} e.g. 'JD'
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};
