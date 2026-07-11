import { ScrollRestoration } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import CartDrawer from '@features/cart/components/CartDrawer/CartDrawer';
import styles from './PageWrapper.module.css';

/**
 * Root layout shell — wraps all pages with Navbar, main content, Footer, and CartDrawer.
 * The Outlet content from react-router is passed as `children`.
 * ScrollRestoration resets scroll to the top on every page navigation.
 */
const PageWrapper = ({ children }) => (
  <div className={styles.wrapper}>
    <ScrollRestoration />
    <Navbar />
    <main className={styles.main}>{children}</main>
    <Footer />
    <CartDrawer />
  </div>
);

export default PageWrapper;

