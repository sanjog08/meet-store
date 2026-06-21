import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectIsAdmin } from '@store/authStore';
import PageWrapper from '@components/layout/PageWrapper/PageWrapper';
import Spinner from '@components/ui/Spinner/Spinner';

// ── Lazy-loaded pages ─────────────────────────────────────────
const Home          = lazy(() => import('@pages/Home'));
const Products      = lazy(() => import('@pages/Products'));
const ProductDetail = lazy(() => import('@pages/ProductDetail'));
const Login         = lazy(() => import('@pages/Auth/Login'));
const Register      = lazy(() => import('@pages/Auth/Register'));
const Profile       = lazy(() => import('@pages/Profile'));
const Cart          = lazy(() => import('@pages/Cart'));
const Checkout      = lazy(() => import('@pages/Checkout'));
const NotFound      = lazy(() => import('@pages/NotFound'));
const AboutUs       = lazy(() => import('@pages/AboutUs'));

// Admin pages
const AdminDashboard    = lazy(() => import('@pages/admin/Dashboard'));
const AdminProducts     = lazy(() => import('@pages/admin/ManageProducts'));
const AdminUsers        = lazy(() => import('@pages/admin/ManageUsers'));
const AdminRequests     = lazy(() => import('@pages/admin/AdminRequests'));
const AdminAboutUs      = lazy(() => import('@pages/admin/AdminAboutUs'));

// ── Route guards ──────────────────────────────────────────────
/** Redirects unauthenticated users to /login */
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

/** Redirects non-admin users to home */
const AdminRoute = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(selectIsAdmin);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};

/** Redirects already logged-in users away from auth pages */
const GuestRoute = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
};

// ── Page loading fallback ─────────────────────────────────────
const PageLoading = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <Spinner size="lg" />
  </div>
);

// ── Router definition ─────────────────────────────────────────
const router = createBrowserRouter([
  {
    // Root layout — always renders Navbar + Footer
    element: (
      <PageWrapper>
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </PageWrapper>
    ),
    children: [
      // Public routes
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'about-us', element: <AboutUs /> },

      // Guest-only routes (redirect if logged in)
      {
        element: <GuestRoute />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
        ],
      },

      // Protected routes (must be logged in)
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'checkout', element: <Checkout /> },
        ],
      },

      // Admin-only routes
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'requests', element: <AdminRequests /> },
          { path: 'about-us', element: <AdminAboutUs /> },
        ],
      },

      // 404
      { path: '*', element: <NotFound /> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
