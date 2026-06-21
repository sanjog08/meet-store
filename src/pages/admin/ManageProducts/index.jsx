import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Image } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@features/products/hooks/useProducts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatCurrency } from '@utils/formatters';
import Button from '@components/ui/Button/Button';
import Input from '@components/ui/Input/Input';
import Modal from '@components/ui/Modal/Modal';
import Badge from '@components/ui/Badge/Badge';
import Spinner from '@components/ui/Spinner/Spinner';
import mediaService from '@services/media.service';
import styles from './ManageProducts.module.css';

const coerceNumber = z.any().transform(v => {
  if (v === '' || v === undefined || v === null) return undefined;
  return Number(v);
});

const schema = z.object({
  name:        z.string().min(2, 'Name is required'),
  price:       coerceNumber.pipe(z.number({ required_error: 'Price is required' }).positive('Price must be positive')),
  description: z.string().min(1, 'Description is required'),
  category:    z.string().min(1, 'Category is required'),
  brand:       z.string().min(1, 'Brand is required'),
  quantity:    coerceNumber.pipe(z.number({ required_error: 'Quantity is required' }).min(0, 'Quantity cannot be negative')),
  discount:    coerceNumber.pipe(z.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100').optional()),
  warranty:    z.string().optional(),
  images:      z.array(z.string()).max(4, 'Maximum 4 images allowed').optional(),
});

const ProductForm = ({ onSubmit, isPending, defaultValues }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { images: [] },
  });

  const [isUploading, setIsUploading] = useState(false);
  const currentImages = watch('images') || [];

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (currentImages.length + files.length > 4) {
      alert('Maximum 4 images allowed');
      return;
    }
    setIsUploading(true);
    try {
      const responses = await mediaService.upload(files);
      const urls = responses.map(r => r.url);
      setValue('images', [...currentImages, ...urls]);
    } catch (err) {
      console.error(err);
      alert('Failed to upload images');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    setValue('images', currentImages.filter((_, idx) => idx !== indexToRemove));
  };

  const onInvalid = (errs) => {
    console.error('Form validation errors:', errs);
    const errorDetails = Object.entries(errs).map(([field, err]) => `${field}: ${err.message}`).join('\n');
    alert(`Validation Failed:\n${errorDetails}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className={styles.form} noValidate>
      <Input id="prod-name" label="Product Name *" error={errors.name?.message} {...register('name')} />
      <div className={styles.formRow}>
        <Input id="prod-price" label="Price ($) *" type="number" step="0.01" error={errors.price?.message} {...register('price')} />
        <Input id="prod-quantity" label="Stocks" type="number" error={errors.quantity?.message} {...register('quantity')} />
      </div>
      <div className={styles.formRow}>
        <Input id="prod-category" label="Category" error={errors.category?.message} {...register('category')} />
        <Input id="prod-brand" label="Brand" error={errors.brand?.message} {...register('brand')} />
      </div>
      <div className={styles.formRow}>
        <Input id="prod-discount" label="Discount (%)" type="number" step="any" error={errors.discount?.message} {...register('discount')} />
        <Input id="prod-warranty" label="Warranty" error={errors.warranty?.message} {...register('warranty')} />
      </div>
      <div className={styles.textareaWrap}>
        <label className={styles.textareaLabel}>Description</label>
        <textarea className={styles.textarea} rows={3} {...register('description')} />
      </div>
      
      <div className={styles.imageSection}>
        <label className={styles.textareaLabel}>Product Images (Max 4)</label>
        <div className={styles.imageGallery}>
          {currentImages.map((url, idx) => (
            <div key={idx} className={styles.imagePreview}>
              <img src={url} alt={`Preview ${idx + 1}`} />
              <button type="button" onClick={() => removeImage(idx)} className={styles.removeImageBtn}>
                <X size={14} />
              </button>
            </div>
          ))}
          {currentImages.length < 4 && (
            <label className={styles.imageUploadBtn}>
              {isUploading ? <Spinner size="sm" /> : <Plus size={20} />}
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={isUploading} hidden />
            </label>
          )}
        </div>
        {errors.images?.message && <span className={styles.errorText}>{errors.images.message}</span>}
      </div>

      <Button type="submit" isLoading={isPending} id="product-form-submit">Save Product</Button>
    </form>
  );
};

const ManageProducts = () => {
  const { data, isLoading } = useProducts();
  const products = data?.data || [];

  const { mutate: create, isPending: isCreating } = useCreateProduct();
  const { mutate: update, isPending: isUpdating } = useUpdateProduct();
  const { mutate: remove, isPending: isDeleting } = useDeleteProduct();

  const [showCreate, setShowCreate] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  return (
    <div className={`${styles.page} container`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Manage Products</h1>
          <p className={styles.subtitle}>{products.length} products total</p>
        </div>
        <Button onClick={() => setShowCreate(true)} id="admin-add-product-btn">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.loading}><Spinner size="lg" /></div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Actions</span>
          </div>
          {products.map((p) => (
            <div key={p._id} className={styles.tableRow}>
              <div className={styles.productCell}>
                <div className={styles.productThumb}>
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.name} onError={(e) => { e.target.style.display = 'none'; }} />
                    : <Image size={18} />
                  }
                </div>
                <span className={styles.productName}>{p.name}</span>
              </div>
              <span>{p.category ? <Badge variant="brand">{p.category}</Badge> : '—'}</span>
              <span className={styles.price}>{formatCurrency(p.price)}</span>
              <span>
                <Badge variant={p.quantity > 0 ? 'success' : 'danger'}>
                  {p.quantity ?? '—'}
                </Badge>
              </span>
              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => setEditProduct(p)} aria-label="Edit"><Pencil size={15} /></button>
                <button className={styles.deleteBtn} onClick={() => setDeleteId(p._id)} aria-label="Delete"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add New Product">
        <ProductForm
          onSubmit={(data) => { create(data); setShowCreate(false); }}
          isPending={isCreating}
        />
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)} title="Edit Product">
        {editProduct && (
          <ProductForm
            defaultValues={editProduct}
            onSubmit={(data) => { update({ id: editProduct._id, data }); setEditProduct(null); }}
            isPending={isUpdating}
          />
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product" size="sm">
        <div className={styles.deleteConfirm}>
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className={styles.deleteActions}>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="danger"
              isLoading={isDeleting}
              onClick={() => { remove(deleteId); setDeleteId(null); }}
              id="admin-delete-confirm-btn"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageProducts;
