import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useAboutUs, useUpsertAboutUs } from '@features/about/hooks/useAboutUs';
import Button from '@components/ui/Button/Button';
import { AdminAboutUsSkeleton } from '@components/ui/Skeleton/Skeleton';
import Input from '@components/ui/Input/Input';
import styles from './AdminAboutUs.module.css';

/* ─ small helpers ─ */
const FieldError = ({ msg }) =>
  msg ? <p className={styles.fieldError}>{msg}</p> : null;

const SectionCard = ({ title, children }) => (
  <div className={styles.card}>
    <h3 className={styles.cardTitle}>{title}</h3>
    {children}
  </div>
);

/* ─ Array field editor (highlights, products, services, etc.) ─ */
const ArrayEditor = ({ label, value = [], onChange }) => {
  const add = () => onChange([...value, '']);
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const edit = (i, v) => onChange(value.map((item, idx) => (idx === i ? v : item)));

  return (
    <div className={styles.arrayEditor}>
      <div className={styles.arrayHeader}>
        <span className={styles.arrayLabel}>{label}</span>
        <button type="button" className={styles.addBtn} onClick={add}>
          <Plus size={14} /> Add
        </button>
      </div>
      <div className={styles.arrayItems}>
        {value.map((item, i) => (
          <div key={i} className={styles.arrayRow}>
            <input
              className={styles.arrayInput}
              value={item}
              onChange={(e) => edit(i, e.target.value)}
              placeholder={`${label} item ${i + 1}`}
            />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => remove(i)}
              aria-label="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {value.length === 0 && (
          <p className={styles.arrayEmpty}>No items yet. Click Add to start.</p>
        )}
      </div>
    </div>
  );
};

/* ─ Contact person editor ─ */
const ContactEditor = ({ contacts = [], onChange }) => {
  const add = () =>
    onChange([...contacts, { name: '', role: '', call: '', whatsapp: '' }]);
  const remove = (i) => onChange(contacts.filter((_, idx) => idx !== i));
  const edit = (i, field, val) =>
    onChange(contacts.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)));

  return (
    <div className={styles.arrayEditor}>
      <div className={styles.arrayHeader}>
        <span className={styles.arrayLabel}>Contacts</span>
        <button type="button" className={styles.addBtn} onClick={add}>
          <Plus size={14} /> Add Person
        </button>
      </div>
      {contacts.map((c, i) => (
        <div key={i} className={styles.contactBlock}>
          <div className={styles.contactBlockHeader}>
            <span>Contact {i + 1}</span>
            <button type="button" className={styles.removeBtn} onClick={() => remove(i)}>
              <Trash2 size={14} />
            </button>
          </div>
          <div className={styles.contactGrid}>
            {['name', 'role', 'call', 'whatsapp'].map((field) => (
              <input
                key={field}
                className={styles.arrayInput}
                value={c[field] || ''}
                onChange={(e) => edit(i, field, e.target.value)}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              />
            ))}
          </div>
        </div>
      ))}
      {contacts.length === 0 && (
        <p className={styles.arrayEmpty}>No contacts yet.</p>
      )}
    </div>
  );
};

/* ══ Main Component ══ */
const AdminAboutUs = () => {
  const { data: info, isLoading } = useAboutUs();
  const { mutate: upsert, isPending } = useUpsertAboutUs();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } =
    useForm({ defaultValues: {
      shopName: '', tagline: '', description: '', city: '', district: '',
      state: '', mapUrl: '', businessType: '',
      workingHours: { regular: '', friday: '' },
      highlights: [], products: [], repairServices: [],
      paymentOptions: [], emiInfo: { available: false, description: '' },
      contacts: [], galleryImages: [],
    } });

  // Populate form when data loads
  useEffect(() => {
    if (info) reset(info);
  }, [info, reset]);

  const watched = watch();

  const onSubmit = (data) => upsert(data);

  if (isLoading) {
    return <AdminAboutUsSkeleton />;
  }

  return (
    <div className={`${styles.page} container`}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Edit Business Info</h1>
          <p className={styles.subtitle}>Changes reflect on the public About Us page immediately.</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="ghost" size="sm" type="button" onClick={() => reset(info || {})}>
            <RefreshCw size={15} /> Reset
          </Button>
          <Button
            size="sm"
            isLoading={isPending}
            onClick={handleSubmit(onSubmit)}
            id="save-about-us-btn"
          >
            <Save size={15} /> Save Changes
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>

        {/* ── Identity ── */}
        <SectionCard title="Business Identity">
          <div className={styles.fieldRow}>
            <Input id="shopName" label="Shop Name" {...register('shopName')} />
            <Input id="businessType" label="Business Type" {...register('businessType')} placeholder="e.g. Single Store" />
          </div>
          <Input id="tagline" label="Tagline" {...register('tagline')} placeholder="e.g. 10+ Years of Customer Trust" />
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              rows={4}
              placeholder="About your business…"
              {...register('description')}
            />
          </div>
        </SectionCard>

        {/* ── Location ── */}
        <SectionCard title="Location">
          <div className={styles.fieldRow}>
            <Input id="city" label="City" {...register('city')} />
            <Input id="district" label="District" {...register('district')} />
            <Input id="state" label="State" {...register('state')} />
          </div>
          <Input id="mapUrl" label="Google Maps URL" {...register('mapUrl')} placeholder="https://maps.app.goo.gl/…" />
        </SectionCard>

        {/* ── Working Hours ── */}
        <SectionCard title="Working Hours">
          <div className={styles.fieldRow}>
            <Input id="regularHours" label="Regular Hours (Mon–Thu, Sat–Sun)" {...register('workingHours.regular')} placeholder="8:00 AM - 8:00 PM" />
            <Input id="fridayHours" label="Friday Hours" {...register('workingHours.friday')} placeholder="9:30 AM - 5:00 PM" />
          </div>
        </SectionCard>

        {/* ── Highlights ── */}
        <SectionCard title="Highlights">
          <ArrayEditor
            label="Highlight"
            value={watched.highlights || []}
            onChange={(v) => setValue('highlights', v)}
          />
        </SectionCard>

        {/* ── Products ── */}
        <SectionCard title="Products Sold">
          <ArrayEditor
            label="Product"
            value={watched.products || []}
            onChange={(v) => setValue('products', v)}
          />
        </SectionCard>

        {/* ── Repair Services ── */}
        <SectionCard title="Repair Services">
          <ArrayEditor
            label="Service"
            value={watched.repairServices || []}
            onChange={(v) => setValue('repairServices', v)}
          />
        </SectionCard>

        {/* ── Payment Options ── */}
        <SectionCard title="Payment Options">
          <ArrayEditor
            label="Payment option"
            value={watched.paymentOptions || []}
            onChange={(v) => setValue('paymentOptions', v)}
          />
        </SectionCard>

        {/* ── EMI Info ── */}
        <SectionCard title="EMI Information">
          <label className={styles.checkboxRow}>
            <input type="checkbox" {...register('emiInfo.available')} />
            <span>EMI Available</span>
          </label>
          <Input id="emiDesc" label="EMI Description" {...register('emiInfo.description')} placeholder="Easy EMI options available…" />
        </SectionCard>

        {/* ── Contacts ── */}
        <SectionCard title="Contact Persons">
          <ContactEditor
            contacts={watched.contacts || []}
            onChange={(v) => setValue('contacts', v)}
          />
        </SectionCard>

        {/* ── Bottom save ── */}
        <div className={styles.formFooter}>
          <Button type="submit" size="lg" isLoading={isPending} id="save-about-us-bottom-btn">
            <Save size={16} /> Save All Changes
          </Button>
        </div>

      </form>
    </div>
  );
};

export default AdminAboutUs;
