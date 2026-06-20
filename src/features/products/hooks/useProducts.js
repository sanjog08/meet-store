import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import productService from '@services/product.service';
import { QUERY_KEYS } from '@utils/constants';

export const useProducts = (params = {}) =>
  useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, params],
    queryFn: () => productService.getAll(params),
  });

export const useProduct = (id) =>
  useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, id],
    queryFn: () => productService.getOne(id),
    enabled: !!id,
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast.success('Product created successfully');
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast.success('Product updated successfully');
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast.success('Product deleted');
    },
    onError: (err) => toast.error(err.message),
  });
};
