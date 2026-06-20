import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '@components/ui/Button/Button';
import { ROUTES } from '@utils/constants';
import styles from './NotFound.module.css';

const NotFound = () => (
  <div className={styles.page}>
    <div className={styles.content}>
      <div className={styles.glowBg} />
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Page not found</h2>
      <p className={styles.subtitle}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className={styles.actions}>
        <Link to={ROUTES.HOME}>
          <Button size="lg" id="not-found-home-btn">
            <Home size={18} /> Go Home
          </Button>
        </Link>
        <button onClick={() => window.history.back()} className={styles.backBtn}>
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    </div>
  </div>
);

export default NotFound;
