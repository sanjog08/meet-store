import { Link } from 'react-router-dom';
import { Package, Globe, MessageCircle, Camera } from 'lucide-react';
import { ROUTES } from '@utils/constants';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={`${styles.inner} container`}>
      <div className={styles.brand}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          <Package size={20} strokeWidth={2.5} />
          Meet Mobile
        </Link>
        <p className={styles.tagline}>
          10+ years of customer trust — Barwaha, Khargone, MP.
        </p>
        <div className={styles.social}>
          <a href="#" className={styles.socialLink} aria-label="Website"><Globe size={18} /></a>
          <a href="#" className={styles.socialLink} aria-label="Chat"><MessageCircle size={18} /></a>
          <a href="#" className={styles.socialLink} aria-label="Gallery"><Camera size={18} /></a>
        </div>
      </div>

      <div className={styles.links}>
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Shop</h4>
          <Link to={ROUTES.PRODUCTS} className={styles.link}>All Products</Link>
          <Link to={ROUTES.CART} className={styles.link}>Cart</Link>
          <Link to={ROUTES.CHECKOUT} className={styles.link}>Checkout</Link>
        </div>
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Account</h4>
          <Link to={ROUTES.LOGIN} className={styles.link}>Login</Link>
          <Link to={ROUTES.REGISTER} className={styles.link}>Register</Link>
          <Link to={ROUTES.PROFILE} className={styles.link}>Profile</Link>
        </div>
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Company</h4>
          <Link to={ROUTES.ABOUT_US} className={styles.link}>About Us</Link>
        </div>
      </div>
    </div>

    <div className={`${styles.bottom} container`}>
      <p className={styles.copy}>
        © {new Date().getFullYear()} Meet Mobile. All rights reserved.
      </p>
      <p className={styles.tech}>Built with React + Express</p>
    </div>
  </footer>
);

export default Footer;
