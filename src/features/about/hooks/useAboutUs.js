import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import aboutUsService from '@services/aboutUs.service';

const QUERY_KEY = ['about-us'];

export const useAboutUs = (lang = 'en') =>
  useQuery({
    queryKey: [...QUERY_KEY, lang],
    queryFn: () => aboutUsService.get(lang),
    retry: false, // 404 is expected if not yet created
  });

export const useUpdateAboutUs = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: aboutUsService.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Business info updated successfully!');
    },
    onError: async (err) => {
      // If it returned 404 (not yet created), use POST instead
      if (err.message?.includes('404') || err.message?.includes('not been set up')) {
        try {
          await aboutUsService.create(err._data);
          qc.invalidateQueries({ queryKey: QUERY_KEY });
          toast.success('Business info created successfully!');
        } catch {
          toast.error('Failed to save business info.');
        }
      } else {
        toast.error(err.message || 'Failed to save business info.');
      }
    },
  });
};

export const useUpsertAboutUs = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      try {
        return await aboutUsService.update(data);
      } catch {
        return await aboutUsService.create(data);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Business info saved successfully!');
    },
    onError: (err) => toast.error(err.message || 'Failed to save.'),
  });
};
