import { useQuery } from '@tanstack/react-query';
import { tripApi } from '../services/trip.api';

export const useTripDetail = (id: string | undefined) =>
  useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      if (!id) throw new Error('Trip id is required');
      const res = await tripApi.getTripDetail(id);
      return res;
    },
    enabled: !!id,
  });

