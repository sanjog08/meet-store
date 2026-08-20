import { useState } from 'react';
import { useAuthStore, selectUser } from '@store/authStore';
import { useUser, useUpdateUser } from '@features/users/hooks/useUsers';
import { useCreateUserAddress, useUpdateUserAddress } from '@features/users/hooks/useUserAddress';
import { useApplyForAdmin } from '@features/admin-requests/hooks/useAdminRequests';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, AtSign, ShieldCheck, ShoppingBag, MapPin, Phone, Globe, Edit3, Plus } from 'lucide-react';
import { getInitials, formatDate } from '@utils/formatters';
import Input from '@components/ui/Input/Input';
import Button from '@components/ui/Button/Button';
import Badge from '@components/ui/Badge/Badge';
import styles from './Profile.module.css';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  addressLine: z.string().min(3, 'Address line is required'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().min(3, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(6, 'Phone number is required'),
});

const Profile = () => {
  const authUser = useAuthStore(selectUser);
  const { data: user, isLoading } = useUser(authUser?.id);
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: applyForAdmin, isPending: isApplying } = useApplyForAdmin();
  const { mutate: createAddress, isPending: isCreating } = useCreateUserAddress();
  const { mutate: updateAddress, isPending: isUpdatingAddr } = useUpdateUserAddress();

  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name || '' },
  });

  const existingAddress = user?.address || null;

  const {
    register: registerAddr,
    handleSubmit: handleSubmitAddr,
    formState: { errors: addrErrors },
    reset: resetAddr,
  } = useForm({
    resolver: zodResolver(addressSchema),
    values: existingAddress
      ? {
          fullName: existingAddress.fullName || '',
          addressLine: existingAddress.addressLine || '',
          city: existingAddress.city || '',
          zip: existingAddress.zip || '',
          country: existingAddress.country || '',
          phone: existingAddress.phone || '',
        }
      : { fullName: '', addressLine: '', city: '', zip: '', country: '', phone: '' },
  });

  const onSubmit = (data) => updateUser({ id: authUser.id, data });

  const onAddressSubmit = (data) => {
    if (existingAddress) {
      updateAddress(
        { userId: authUser.id, data },
        { onSuccess: () => setIsEditingAddress(false) },
      );
    } else {
      createAddress(
        { userId: authUser.id, data },
        { onSuccess: () => setIsEditingAddress(false) },
      );
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAddress(false);
    resetAddr();
  };

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

          {/* Shipping Address */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Shipping Address</h3>
              {existingAddress && !isEditingAddress && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingAddress(true)}
                  id="profile-edit-address-btn"
                >
                  <Edit3 size={14} />
                  Edit
                </Button>
              )}
            </div>

            {/* Display saved address (readonly) */}
            {existingAddress && !isEditingAddress && (
              <div className={styles.addressDisplay}>
                <div className={styles.addressRow}>
                  <User size={15} />
                  <div>
                    <span className={styles.fieldLabel}>Full Name</span>
                    <span className={styles.fieldValue}>{existingAddress.fullName}</span>
                  </div>
                </div>
                <div className={styles.addressRow}>
                  <MapPin size={15} />
                  <div>
                    <span className={styles.fieldLabel}>Address</span>
                    <span className={styles.fieldValue}>{existingAddress.addressLine}</span>
                  </div>
                </div>
                <div className={styles.addressRowGrid}>
                  <div className={styles.addressRow}>
                    <MapPin size={15} />
                    <div>
                      <span className={styles.fieldLabel}>City</span>
                      <span className={styles.fieldValue}>{existingAddress.city}</span>
                    </div>
                  </div>
                  <div className={styles.addressRow}>
                    <MapPin size={15} />
                    <div>
                      <span className={styles.fieldLabel}>ZIP</span>
                      <span className={styles.fieldValue}>{existingAddress.zip}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.addressRow}>
                  <Globe size={15} />
                  <div>
                    <span className={styles.fieldLabel}>Country</span>
                    <span className={styles.fieldValue}>{existingAddress.country}</span>
                  </div>
                </div>
                <div className={styles.addressRow}>
                  <Phone size={15} />
                  <div>
                    <span className={styles.fieldLabel}>Phone</span>
                    <span className={styles.fieldValue}>{existingAddress.phone}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Address form (create or edit) */}
            {(!existingAddress || isEditingAddress) && (
              <form onSubmit={handleSubmitAddr(onAddressSubmit)} className={styles.form}>
                {!existingAddress && (
                  <p className={styles.addressHint}>
                    <Plus size={14} />
                    Add your shipping address for faster checkout.
                  </p>
                )}
                <Input
                  id="address-fullName"
                  label="Full Name"
                  placeholder="John Doe"
                  error={addrErrors.fullName?.message}
                  {...registerAddr('fullName')}
                />
                <Input
                  id="address-addressLine"
                  label="Address Line"
                  placeholder="123 Main Street, Apt 4"
                  error={addrErrors.addressLine?.message}
                  {...registerAddr('addressLine')}
                />
                <div className={styles.formRow}>
                  <Input
                    id="address-city"
                    label="City"
                    placeholder="Mumbai"
                    error={addrErrors.city?.message}
                    {...registerAddr('city')}
                  />
                  <Input
                    id="address-zip"
                    label="ZIP Code"
                    placeholder="400001"
                    error={addrErrors.zip?.message}
                    {...registerAddr('zip')}
                  />
                </div>
                <Input
                  id="address-country"
                  label="Country"
                  placeholder="India"
                  error={addrErrors.country?.message}
                  {...registerAddr('country')}
                />
                <Input
                  id="address-phone"
                  label="Phone"
                  placeholder="+91 9876543210"
                  error={addrErrors.phone?.message}
                  {...registerAddr('phone')}
                />
                <div className={styles.formActions}>
                  <Button
                    type="submit"
                    isLoading={isCreating || isUpdatingAddr}
                    id="profile-save-address-btn"
                  >
                    {existingAddress ? 'Update Address' : 'Save Address'}
                  </Button>
                  {isEditingAddress && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      id="profile-cancel-address-btn"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}
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
