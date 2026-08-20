import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Lock, CreditCard, MapPin, Check, Edit3, MessageCircle } from 'lucide-react';
import { useCartStore, selectCartItems, selectTotalPrice } from '@store/cartStore';
import { useAuthStore, selectIsAuthenticated, selectUser } from '@store/authStore';
import { useUserAddress, useCreateUserAddress, useUpdateUserAddress } from '@features/users/hooks/useUserAddress';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatCurrency } from '@utils/formatters';
import { ROUTES, SHIPPING, BUSINESS } from '@utils/constants';
import Input from '@components/ui/Input/Input';
import Button from '@components/ui/Button/Button';
import styles from './Checkout.module.css';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  addressLine: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().min(3, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(6, 'Phone number is required'),
});

const Checkout = () => {
  const items = useCartStore(selectCartItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const authUser = useAuthStore(selectUser);
  const shippingCost = totalPrice > SHIPPING.FREE_ABOVE ? 0 : SHIPPING.FLAT_FEE;

  const userId = authUser?.id;
  const { data: savedAddress, isLoading: isLoadingAddress } = useUserAddress(userId);
  const { mutate: createAddress, isPending: isCreating } = useCreateUserAddress();
  const { mutate: updateAddress, isPending: isUpdatingAddr } = useUpdateUserAddress();

  const hasAddress = !!savedAddress && !savedAddress?.message;
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const showForm = isAuthenticated && (!hasAddress || isEditingAddress);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(addressSchema),
    values: hasAddress
      ? {
          fullName: savedAddress.fullName || '',
          addressLine: savedAddress.addressLine || '',
          city: savedAddress.city || '',
          zip: savedAddress.zip || '',
          country: savedAddress.country || '',
          phone: savedAddress.phone || '',
        }
      : { fullName: '', addressLine: '', city: '', zip: '', country: '', phone: '' },
  });

  const onAddressSubmit = (data) => {
    if (hasAddress) {
      updateAddress(
        { userId, data },
        { onSuccess: () => setIsEditingAddress(false) },
      );
    } else {
      createAddress(
        { userId, data },
        { onSuccess: () => setIsEditingAddress(false) },
      );
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAddress(false);
    reset();
  };

  if (items.length === 0) {
    return (
      <div className={`${styles.empty} container`}>
        <ShoppingBag size={64} strokeWidth={1} />
        <h1>Nothing to checkout</h1>
        <p>Add items to your cart before checking out.</p>
        <Link to={ROUTES.PRODUCTS}>
          <Button size="lg" id="checkout-browse-btn">Browse Products <ArrowRight size={18} /></Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={`${styles.page} container`}>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.layout}>
        {/* Left — Forms */}
        <div className={styles.forms}>
          {/* Shipping */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <MapPin size={18} />
                <h2>Shipping Address</h2>
              </div>
              {hasAddress && !isEditingAddress && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingAddress(true)}
                  id="checkout-edit-address-btn"
                >
                  <Edit3 size={14} />
                  Edit
                </Button>
              )}
            </div>

            {/* Not authenticated — show mock fields */}
            {!isAuthenticated && (
              <>
                <div className={styles.placeholderNotice}>
                  <Lock size={14} />
                  <span><Link to={ROUTES.LOGIN} className={styles.noticeLink}>Sign in</Link> to manage your shipping address.</span>
                </div>
                <div className={styles.mockFields}>
                  <div className={styles.mockField}><span>Full Name</span><div className={styles.mockInput} /></div>
                  <div className={styles.mockField}><span>Address Line</span><div className={styles.mockInput} /></div>
                  <div className={styles.mockRow}>
                    <div className={styles.mockField}><span>City</span><div className={styles.mockInput} /></div>
                    <div className={styles.mockField}><span>ZIP</span><div className={styles.mockInput} /></div>
                  </div>
                  <div className={styles.mockField}><span>Country</span><div className={styles.mockInput} /></div>
                  <div className={styles.mockField}><span>Phone</span><div className={styles.mockInput} /></div>
                </div>
              </>
            )}

            {/* Authenticated + loading */}
            {isAuthenticated && isLoadingAddress && (
              <div className={styles.mockFields}>
                <div className={styles.mockField}><span>Full Name</span><div className={styles.mockInput} /></div>
                <div className={styles.mockField}><span>Address Line</span><div className={styles.mockInput} /></div>
                <div className={styles.mockRow}>
                  <div className={styles.mockField}><span>City</span><div className={styles.mockInput} /></div>
                  <div className={styles.mockField}><span>ZIP</span><div className={styles.mockInput} /></div>
                </div>
                <div className={styles.mockField}><span>Country</span><div className={styles.mockInput} /></div>
                <div className={styles.mockField}><span>Phone</span><div className={styles.mockInput} /></div>
              </div>
            )}

            {/* Authenticated + saved address (readonly) */}
            {isAuthenticated && !isLoadingAddress && hasAddress && !isEditingAddress && (
              <div className={styles.savedAddress}>
                <div className={styles.savedBadge}>
                  <Check size={14} />
                  Address saved
                </div>
                <div className={styles.savedDetails}>
                  <p className={styles.savedName}>{savedAddress.fullName}</p>
                  <p>{savedAddress.addressLine}</p>
                  <p>{savedAddress.city}, {savedAddress.zip}</p>
                  <p>{savedAddress.country}</p>
                  <p className={styles.savedPhone}>{savedAddress.phone}</p>
                </div>
              </div>
            )}

            {/* Authenticated + form (create or edit) */}
            {isAuthenticated && !isLoadingAddress && showForm && (
              <form onSubmit={handleSubmit(onAddressSubmit)} className={styles.addressForm}>
                <Input
                  id="checkout-fullName"
                  label="Full Name"
                  placeholder="John Doe"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
                <Input
                  id="checkout-addressLine"
                  label="Address Line"
                  placeholder="123 Main Street, Apt 4"
                  error={errors.addressLine?.message}
                  {...register('addressLine')}
                />
                <div className={styles.addressFormRow}>
                  <Input
                    id="checkout-city"
                    label="City"
                    placeholder="Mumbai"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                  <Input
                    id="checkout-zip"
                    label="ZIP Code"
                    placeholder="400001"
                    error={errors.zip?.message}
                    {...register('zip')}
                  />
                </div>
                <Input
                  id="checkout-country"
                  label="Country"
                  placeholder="India"
                  error={errors.country?.message}
                  {...register('country')}
                />
                <Input
                  id="checkout-phone"
                  label="Phone"
                  placeholder="+91 9876543210"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
                <div className={styles.addressFormActions}>
                  <Button
                    type="submit"
                    isLoading={isCreating || isUpdatingAddr}
                    id="checkout-save-address-btn"
                  >
                    {hasAddress ? 'Update Address' : 'Save Address'}
                  </Button>
                  {isEditingAddress && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      id="checkout-cancel-address-btn"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Payment */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <CreditCard size={18} />
                <h2>Payment Details</h2>
              </div>
            </div>
            <div className={styles.placeholderNotice}>
              <Lock size={14} />
              <span>Payment integration will be enabled once the orders API is live.</span>
            </div>
            <div className={styles.mockFields}>
              <div className={styles.mockField}><span>Card Number</span><div className={styles.mockInput} /></div>
              <div className={styles.mockRow}>
                <div className={styles.mockField}><span>Expiry</span><div className={styles.mockInput} /></div>
                <div className={styles.mockField}><span>CVV</span><div className={styles.mockInput} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.summaryItems}>
            {items.map(({ product, quantity }) => (
              <div key={product._id} className={styles.summaryItem}>
                <img
                  src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/60/60`}
                  alt={product.name}
                  className={styles.summaryImage}
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${product._id}/60/60`; }}
                />
                <div className={styles.summaryItemInfo}>
                  <p className={styles.summaryItemName}>{product.name}</p>
                  <p className={styles.summaryItemQty}>Qty: {quantity}</p>
                </div>
                <p className={styles.summaryItemPrice}>{formatCurrency(product.price * quantity)}</p>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping</span>
              <span className={shippingCost === 0 ? styles.free : ''}>
                {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
              </span>
            </div>
            <div className={styles.divider} />
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total</span>
              <span>{formatCurrency(totalPrice + shippingCost)}</span>
            </div>
          </div>

          <div className={styles.orderActions}>
            <Button
              size="lg"
              fullWidth
              disabled
              id="checkout-place-order-btn"
              title="Order placement coming soon"
            >
              <Lock size={16} />
              Place Order (Coming Soon)
            </Button>
            <a
              href={`${BUSINESS.WHATSAPP_URL}?text=${encodeURIComponent(items.map(({ product }) => `${product.name} is available now?`).join('\n'))}`}
              target="_blank"
              rel="noreferrer"
              className={styles.whatsappLink}
            >
              <Button
                variant="outline"
                size="lg"
                fullWidth
                id="checkout-whatsapp-btn"
              >
                <MessageCircle size={16} />
                WhatsApp
              </Button>
            </a>
          </div>

          {!isAuthenticated && (
            <p className={styles.loginNote}>
              <Link to={ROUTES.LOGIN}>Sign in</Link> for a faster checkout experience.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
