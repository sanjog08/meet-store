import { Link } from 'react-router-dom';
import { Users, Package, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { useProducts } from '@features/products/hooks/useProducts';
import { useUsers } from '@features/users/hooks/useUsers';
import { useAdminRequests } from '@features/admin-requests/hooks/useAdminRequests';
import { ROUTES } from '@utils/constants';
import Spinner from '@components/ui/Spinner/Spinner';
import styles from './Dashboard.module.css';

const StatCard = ({ icon: Icon, label, value, to, color, isLoading }) => (
  <Link to={to} className={styles.statCard}>
    <div className={styles.statIcon} style={{ '--icon-color': color }}>
      <Icon size={22} />
    </div>
    <div className={styles.statInfo}>
      <span className={styles.statLabel}>{label}</span>
      {isLoading
        ? <div className={`skeleton ${styles.statSkeleton}`} />
        : <span className={styles.statValue}>{value}</span>
      }
    </div>
    <ArrowRight size={16} className={styles.statArrow} />
  </Link>
);

const Dashboard = () => {
  const { data: productsData, isLoading: loadingProducts } = useProducts();
  const { data: usersData,    isLoading: loadingUsers }    = useUsers();
  const { data: requestsData, isLoading: loadingRequests } = useAdminRequests({ status: 'pending' });

  const productCount = productsData?.data?.length ?? 0;
  const userCount    = usersData?.data?.length ?? 0;
  const pendingCount = requestsData?.data?.length ?? 0;

  const stats = [
    { icon: Package,     label: 'Total Products',    value: productCount, to: ROUTES.ADMIN_PRODUCTS, color: '#6366f1', isLoading: loadingProducts },
    { icon: Users,       label: 'Total Users',        value: userCount,    to: ROUTES.ADMIN_USERS,    color: '#22c55e', isLoading: loadingUsers },
    { icon: ShieldCheck, label: 'Pending Requests',   value: pendingCount, to: ROUTES.ADMIN_REQUESTS, color: '#f59e0b', isLoading: loadingRequests },
    { icon: TrendingUp,  label: 'Revenue (soon)',      value: '—',          to: '#',                   color: '#3b82f6', isLoading: false },
  ];

  return (
    <div className={`${styles.page} container`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Overview of your store&apos;s performance</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick links */}
      <div className={styles.quickLinks}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.linkGrid}>
          {[
            { to: ROUTES.ADMIN_PRODUCTS, label: 'Manage Products', icon: Package, desc: 'Add, edit, or delete products' },
            { to: ROUTES.ADMIN_USERS,    label: 'Manage Users',    icon: Users,   desc: 'View and manage user accounts' },
            { to: ROUTES.ADMIN_REQUESTS, label: 'Admin Requests',  icon: ShieldCheck, desc: 'Review pending admin applications' },
          ].map(({ to, label, icon: Icon, desc }) => (
            <Link key={to} to={to} className={styles.linkCard}>
              <div className={styles.linkIcon}><Icon size={20} /></div>
              <div>
                <p className={styles.linkTitle}>{label}</p>
                <p className={styles.linkDesc}>{desc}</p>
              </div>
              <ArrowRight size={16} className={styles.linkArrow} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
