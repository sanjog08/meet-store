import { useQuery } from '@tanstack/react-query';
import todaysOfferService from '@services/todaysOffer.service';

export const useTodaysOffer = () =>
  useQuery({
    queryKey: ['todays-offer'],
    queryFn: todaysOfferService.getAll,
    staleTime: 1000 * 60 * 5,
  });
