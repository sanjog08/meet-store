import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Package, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
import { useAuthStore, selectIsAuthenticated, selectIsAdmin, selectUser } from '@store/authStore';
import { useUiStore } from '@store/uiStore';
import { selectItemCount, useCartStore } from '@store/cartStore';
import { getInitials } from '@utils/formatters';
import { ROUTES } from '@utils/constants';
import authService from '@services/auth.service';
import toast from 'react-hot-toast';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(selectIsAdmin);
  const user = useAuthStore(selectUser);
  const { logout, refreshToken } = useAuthStore();
  const { toggleMobileMenu, isMobileMenuOpen, closeMobileMenu, openCartDrawer } = useUiStore();
  const itemCount = useCartStore(selectItemCount);

  const handleLogout = async () => {
    try {
      if (refreshToken) await authService.logout(refreshToken);
    } catch {
      // Ignore API error — still log out locally
    } finally {
      logout();
      toast.success('Logged out successfully');
      navigate(ROUTES.HOME);
      closeMobileMenu();
    }
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`}>
        {/* Logo */}
        <Link to={ROUTES.HOME} className={styles.logo} onClick={closeMobileMenu}>
          <Package size={24} strokeWidth={2.5} />
          <span>Meet Mobile</span>
        </Link>

        {/* Desktop nav links */}
        <div className={styles.navLinks}>
          <NavLink to={ROUTES.PRODUCTS} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            Products
          </NavLink>
          {isAdmin && (
            <NavLink to={ROUTES.ADMIN_DASHBOARD} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              <LayoutDashboard size={15} />
              Admin
            </NavLink>
          )}
        </div>

        {/* Right actions */}
        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={openCartDrawer}
            aria-label="Open cart"
            id="navbar-cart-btn"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className={styles.cartBadge}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button className={styles.avatar} id="navbar-user-menu">
                {getInitials(user?.name)}
              </button>
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <p className={styles.dropdownName}>{user?.name}</p>
                  <p className={styles.dropdownEmail}>{user?.email}</p>
                </div>
                <div className={styles.dropdownDivider} />
                <Link to={ROUTES.PROFILE} className={styles.dropdownItem}>
                  <User size={15} /> Profile
                </Link>
                {isAdmin && (
                  <Link to={ROUTES.ADMIN_DASHBOARD} className={styles.dropdownItem}>
                    <ShieldCheck size={15} /> Admin Panel
                  </Link>
                )}
                <div className={styles.dropdownDivider} />
                <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutItem}`}>
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.authLinks}>
              <Link to={ROUTES.LOGIN} className={styles.loginLink}>Login</Link>
              <Link to={ROUTES.REGISTER} className={styles.registerLink}>Get Started</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            id="navbar-mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <NavLink to={ROUTES.PRODUCTS} className={styles.mobileLink} onClick={closeMobileMenu}>Products</NavLink>
          {isAdmin && (
            <NavLink to={ROUTES.ADMIN_DASHBOARD} className={styles.mobileLink} onClick={closeMobileMenu}>Admin Panel</NavLink>
          )}
          {isAuthenticated ? (
            <>
              <NavLink to={ROUTES.PROFILE} className={styles.mobileLink} onClick={closeMobileMenu}>Profile</NavLink>
              <button onClick={handleLogout} className={`${styles.mobileLink} ${styles.mobileLinkBtn}`}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to={ROUTES.LOGIN} className={styles.mobileLink} onClick={closeMobileMenu}>Login</NavLink>
              <NavLink to={ROUTES.REGISTER} className={styles.mobileLink} onClick={closeMobileMenu}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
