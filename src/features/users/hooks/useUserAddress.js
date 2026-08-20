import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userAddressService from '@services/userAddress.service';
import { QUERY_KEYS } from '@utils/constants';

export const useUserAddress = (userId) =>
  useQuery({
    queryKey: [QUERY_KEYS.USER_ADDRESS, userId],
    queryFn: () => userAddressService.getAddress(userId),
    enabled: !!userId,
    retry: false,
  });

export const useCreateUserAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }) => userAddressService.createAddress(userId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ADDRESS, variables.userId] });
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.USER, variables.userId] });
      toast.success('Address saved successfully');
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useUpdateUserAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }) => userAddressService.updateAddress(userId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ADDRESS, variables.userId] });
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.USER, variables.userId] });
      toast.success('Address updated successfully');
    },
    onError: (err) => toast.error(err.message),
  });
};
