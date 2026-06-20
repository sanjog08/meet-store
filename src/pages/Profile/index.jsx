import { useAuthStore, selectUser } from '@store/authStore';
import { useUser, useUpdateUser } from '@features/users/hooks/useUsers';
import { useApplyForAdmin } from '@features/admin-requests/hooks/useAdminRequests';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, AtSign, ShieldCheck, ShoppingBag } from 'lucide-react';
import { getInitials, formatDate } from '@utils/formatters';
import Input from '@components/ui/Input/Input';
import Button from '@components/ui/Button/Button';
import Badge from '@components/ui/Badge/Badge';
import styles from './Profile.module.css';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const Profile = () => {
  const authUser = useAuthStore(selectUser);
  const { data: user, isLoading } = useUser(authUser?.id);
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: applyForAdmin, isPending: isApplying } = useApplyForAdmin();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    values: { name: user?.name || '' },
  });

  const onSubmit = (data) => updateUser({ id: authUser.id, data });

  if (isLoading) {
    return <div className={styles.loading}>Loading profile…</div>;
  }

  const profile = user || authUser;

  return (
    <div className={`${styles.page} container`}>
      <h1 className={styles.pageTitle}>My Profile</h1>

      <div className={styles.layout}>
        {/* Sidebar card */}
        <div className={styles.profileCard}>
          <div className={styles.avatar}>{getInitials(profile?.name)}</div>
          <h2 className={styles.name}>{profile?.name}</h2>
          <p className={styles.username}>@{profile?.username}</p>
          <Badge variant={profile?.role === 'admin' ? 'brand' : 'default'}>
            {profile?.role}
          </Badge>
          <p className={styles.joined}>Member since {formatDate(profile?.createdAt)}</p>

          {profile?.role === 'customer' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyForAdmin()}
              isLoading={isApplying}
              fullWidth
              id="profile-apply-admin-btn"
            >
              <ShieldCheck size={15} />
              Apply for Admin
            </Button>
          )}
        </div>

        {/* Edit form */}
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Account Information</h3>

            <div className={styles.readonlyFields}>
              <div className={styles.readonlyField}>
                <Mail size={15} />
                <div>
                  <span className={styles.fieldLabel}>Email</span>
                  <span className={styles.fieldValue}>{profile?.email}</span>
                </div>
              </div>
              <div className={styles.readonlyField}>
                <AtSign size={15} />
                <div>
                  <span className={styles.fieldLabel}>Username</span>
                  <span className={styles.fieldValue}>{profile?.username}</span>
                </div>
              </div>
              <div className={styles.readonlyField}>
                <User size={15} />
                <div>
                  <span className={styles.fieldLabel}>Role</span>
                  <span className={styles.fieldValue}>{profile?.role}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Edit Profile</h3>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <Input
                id="profile-name"
                label="Full Name"
                placeholder="Your full name"
                error={errors.name?.message}
                {...register('name')}
              />
              <Button type="submit" isLoading={isUpdating} id="profile-save-btn">
                Save Changes
              </Button>
            </form>
          </div>

          {/* Orders placeholder */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Order History</h3>
            <div className={styles.ordersPlaceholder}>
              <ShoppingBag size={40} strokeWidth={1} />
              <p>No orders yet</p>
              <span>Your order history will appear here once the feature is live.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
