/** Application-wide constants */

// ── Localisation ───────────────────────────────────────────────
export const CURRENCY = {
  /** Symbol shown in the UI */
  SYMBOL: '₹',
  /** ISO 4217 code used by Intl.NumberFormat */
  CODE: 'INR',
  /** BCP 47 locale for number formatting (en-IN gives ₹1,29,999 style) */
  LOCALE: 'en-IN',
};

// ── Business / Contact ─────────────────────────────────────────
export const BUSINESS = {
  NAME: 'Meet Mobile',
  WHATSAPP_NUMBER: '919039760672',          // include country code, no +
  WHATSAPP_URL: 'https://wa.me/919039760672',
  MAP_URL: 'https://maps.app.goo.gl/VuM5A3nLQCUyHUQJA',
  COUNTRY_CODE: '91',                       // dialing prefix for local numbers
};

// ── Roles ──────────────────────────────────────────────────────
export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
};

// ── Routes ─────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ABOUT_US: '/about-us',
  // Admin
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_USERS: '/admin/users',
  ADMIN_REQUESTS: '/admin/requests',
  ADMIN_ABOUT_US: '/admin/about-us',
  // Utils
  NOT_FOUND: '*',
};

// ── React-Query keys ───────────────────────────────────────────
export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  USERS: 'users',
  USER: 'user',
  ADMIN_REQUESTS: 'admin-requests',
  ABOUT_US: 'about-us',
};

// ── Pagination ─────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  HOME_PRODUCTS_LIMIT: 8,
};

// ── Order / Request status ─────────────────────────────────────
export const ORDER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// ── Stock display thresholds ───────────────────────────────────
export const STOCK = {
  /** Units at or below this number show "Only X left" warning */
  LOW_THRESHOLD: 4,
};

// ── Shipping ───────────────────────────────────────────────────
export const SHIPPING = {
  /** Order total (₹) above which shipping is free */
  FREE_ABOVE: 500,
  /** Flat shipping fee in ₹ when below the free threshold */
  FLAT_FEE: 49,
};

// ── Product card / listing UI ──────────────────────────────────
export const PRODUCT_UI = {
  /** Products created within this many days are labelled "NEW" */
  NEW_BADGE_DAYS: 7,
  /** Auto-slide interval for hero carousel (ms) */
  CAROUSEL_INTERVAL_MS: 5000,
};
