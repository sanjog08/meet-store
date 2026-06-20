/** Application-wide constants */

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
};

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  CART: '/cart',
  CHECKOUT: '/checkout',
  // Admin
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_USERS: '/admin/users',
  ADMIN_REQUESTS: '/admin/requests',
  // Utils
  NOT_FOUND: '*',
};

export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  USERS: 'users',
  USER: 'user',
  ADMIN_REQUESTS: 'admin-requests',
};

export const PAGINATION = {
  DEFAULT_LIMIT: 12,
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};
