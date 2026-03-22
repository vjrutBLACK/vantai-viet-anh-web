import { useQuery } from '@tanstack/react-query';
import { fetchCustomerTrips } from '../services';

type Params = {
  page?: number;
  limit?: number;
};

export const useCustomerTrips = (id: string | undefined, params: Params) =>
  useQuery({
    queryKey: ['customer-trips', id, params],
    queryFn: () => fetchCustomerTrips(id!, params),
    enabled: !!id,
  });

