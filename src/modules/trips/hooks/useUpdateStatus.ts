import { useMutation } from '@tanstack/react-query';
import { tripApi } from '../services/trip.api';

export const useUpdateStatus = () =>
  useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      tripApi.updateTripStatus(id, status),
  });

