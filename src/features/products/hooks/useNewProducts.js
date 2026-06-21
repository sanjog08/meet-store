import { useQuery } from '@tanstack/react-query';
import newProductsService from '@services/newProducts.service';

export const useNewProducts = () =>
  useQuery({
    queryKey: ['new-products'],
    queryFn: newProductsService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
