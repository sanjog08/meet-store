import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userService from '@services/user.service';
import { QUERY_KEYS } from '@utils/constants';

export const useUsers = (params = {}) =>
  useQuery({
    queryKey: [QUERY_KEYS.USERS, params],
    queryFn: () => userService.getAll(params),
  });

export const useUser = (id) =>
  useQuery({
    queryKey: [QUERY_KEYS.USER, id],
    queryFn: () => userService.getOne(id),
    enabled: !!id,
  });

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
      toast.success('User updated successfully');
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useMakeAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.makeAdmin,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      toast.success('User promoted to admin');
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      toast.success('User deleted');
    },
    onError: (err) => toast.error(err.message),
  });
};
