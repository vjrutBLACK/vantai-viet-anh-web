import { useQuery } from '@tanstack/react-query';
import { fetchCustomerPayments } from '../services';

type Params = {
  page?: number;
  limit?: number;
};

export const useCustomerPayments = (id: string | undefined, params: Params) =>
  useQuery({
    queryKey: ['customer-payments', id, params],
    queryFn: () => fetchCustomerPayments(id!, params),
    enabled: !!id,
  });

