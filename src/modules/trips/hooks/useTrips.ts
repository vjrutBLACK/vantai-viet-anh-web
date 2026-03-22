import { useQuery } from '@tanstack/react-query';
import { tripApi, type QueryTripParams } from '../services/trip.api';

export const useTrips = (params: QueryTripParams) => {
  return useQuery({
    queryKey: ['trips', params],
    queryFn: async () => {
      const res = await tripApi.getTrips(params);
      return res;
    },
  });
};

