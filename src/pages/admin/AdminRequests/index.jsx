import { useState } from 'react';
import { Check, X, Trash2 } from 'lucide-react';
import { useAdminRequests, useReviewRequest, useWithdrawRequest } from '@features/admin-requests/hooks/useAdminRequests';
import { formatDate, getInitials } from '@utils/formatters';
import Badge from '@components/ui/Badge/Badge';
import Button from '@components/ui/Button/Button';
import { RequestCardsSkeleton } from '@components/ui/Skeleton/Skeleton';
import styles from './AdminRequests.module.css';

const STATUS_VARIANT = {
  pending:  'warning',
  approved: 'success',
  rejected: 'danger',
};

const AdminRequests = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useAdminRequests(statusFilter ? { status: statusFilter } : {});
  const requests = data?.data || [];

  const { mutate: review, isPending: isReviewing } = useReviewRequest();
  const { mutate: withdraw } = useWithdrawRequest();

  return (
    <div className={`${styles.page} container`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Requests</h1>
          <p className={styles.subtitle}>{requests.length} requests</p>
        </div>

        <div className={styles.filters}>
          {['All', 'pending', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              id={`request-filter-${s}`}
              className={`${styles.filterBtn} ${(statusFilter === s || (s === 'All' && !statusFilter)) ? styles.active : ''}`}
              onClick={() => setStatusFilter(s === 'All' ? '' : s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <RequestCardsSkeleton count={5} />
      ) : requests.length === 0 ? (
        <div className={styles.empty}>
          <p>No admin requests found{statusFilter ? ` with status "${statusFilter}"` : ''}.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {requests.map((req) => (
            <div key={req._id} className={styles.card}>
              <div className={styles.cardLeft}>
                <div className={styles.avatar}>{getInitials(req.user?.name || '?')}</div>
                <div>
                  <p className={styles.userName}>{req.user?.name || 'Unknown'}</p>
                  <p className={styles.userEmail}>{req.user?.email || req.user}</p>
                  <p className={styles.date}>Applied {formatDate(req.createdAt)}</p>
                </div>
              </div>

              <Badge variant={STATUS_VARIANT[req.status] || 'default'}>
                {req.status}
              </Badge>

              {req.status === 'pending' && (
                <div className={styles.actions}>
                  <Button
                    size="sm"
                    onClick={() => review({ id: req._id, action: 'approve' })}
                    isLoading={isReviewing}
                    id={`approve-request-${req._id}`}
                  >
                    <Check size={14} /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => review({ id: req._id, action: 'reject' })}
                    isLoading={isReviewing}
                    id={`reject-request-${req._id}`}
                  >
                    <X size={14} /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
