import { useState } from 'react';
import { Trash2, ShieldCheck } from 'lucide-react';
import { useUsers, useDeleteUser, useMakeAdmin } from '@features/users/hooks/useUsers';
import { formatDate, getInitials } from '@utils/formatters';
import Button from '@components/ui/Button/Button';
import Badge from '@components/ui/Badge/Badge';
import Modal from '@components/ui/Modal/Modal';
import { TableSkeleton } from '@components/ui/Skeleton/Skeleton';
import styles from './ManageUsers.module.css';

const ManageUsers = () => {
  const [roleFilter, setRoleFilter] = useState('');
  const { data, isLoading } = useUsers(roleFilter ? { role: roleFilter } : {});
  const users = data?.data || [];

  const { mutate: makeAdmin, isPending: isPromoting } = useMakeAdmin();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const [promoteId, setPromoteId] = useState(null);
  const [deleteId,  setDeleteId]  = useState(null);

  return (
    <div className={`${styles.page} container`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Manage Users</h1>
          <p className={styles.subtitle}>{users.length} users</p>
        </div>
        <div className={styles.filters}>
          {['All', 'customer', 'admin'].map((r) => (
            <button
              key={r}
              id={`user-filter-${r}`}
              className={`${styles.filterBtn} ${(roleFilter === r || (r === 'All' && !roleFilter)) ? styles.active : ''}`}
              onClick={() => setRoleFilter(r === 'All' ? '' : r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} columns={[2, 2, 1, 1, 1]} />
      ) : users.length === 0 ? (
        <p className={styles.empty}>No users found.</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>User</span>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>
          {users.map((u) => (
            <div key={u._id} className={styles.tableRow}>
              <div className={styles.userCell}>
                <div className={styles.avatar}>{getInitials(u.name)}</div>
                <div>
                  <p className={styles.userName}>{u.name}</p>
                  <p className={styles.userUsername}>@{u.username}</p>
                </div>
              </div>
              <span className={styles.email}>{u.email}</span>
              <span>
                <Badge variant={u.role === 'admin' ? 'brand' : 'default'}>{u.role}</Badge>
              </span>
              <span className={styles.date}>{formatDate(u.createdAt)}</span>
              <div className={styles.actions}>
                {u.role !== 'admin' && (
                  <button
                    className={styles.promoteBtn}
                    onClick={() => setPromoteId(u._id)}
                    aria-label="Promote to admin"
                    title="Make admin"
                  >
                    <ShieldCheck size={15} />
                  </button>
                )}
                <button
                  className={styles.deleteBtn}
                  onClick={() => setDeleteId(u._id)}
                  aria-label="Delete user"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Promote confirm */}
      <Modal isOpen={!!promoteId} onClose={() => setPromoteId(null)} title="Promote User" size="sm">
        <div className={styles.confirmDialog}>
          <p>Promote this user to <strong>admin</strong>? They will gain full admin privileges.</p>
          <div className={styles.confirmActions}>
            <Button variant="secondary" onClick={() => setPromoteId(null)}>Cancel</Button>
            <Button
              isLoading={isPromoting}
              onClick={() => { makeAdmin(promoteId); setPromoteId(null); }}
              id="user-promote-confirm-btn"
            >
              Promote to Admin
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete User" size="sm">
        <div className={styles.confirmDialog}>
          <p>Are you sure you want to delete this user? This action is irreversible.</p>
          <div className={styles.confirmActions}>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="danger"
              isLoading={isDeleting}
              onClick={() => { deleteUser(deleteId); setDeleteId(null); }}
              id="user-delete-confirm-btn"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
