import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import adminRequestService from '@services/adminRequest.service';
import { QUERY_KEYS } from '@utils/constants';

export const useAdminRequests = (params = {}) =>
  useQuery({
    queryKey: [QUERY_KEYS.ADMIN_REQUESTS, params],
    queryFn: () => adminRequestService.getAll(params),
  });

export const useApplyForAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminRequestService.apply,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_REQUESTS] });
      toast.success('Admin request submitted successfully');
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useReviewRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }) => adminRequestService.review(id, action),
    onSuccess: (_, { action }) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_REQUESTS] });
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      toast.success(`Request ${action}d successfully`);
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useWithdrawRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminRequestService.withdraw,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_REQUESTS] });
      toast.success('Request withdrawn');
    },
    onError: (err) => toast.error(err.message),
  });
};
