import { useMutation } from '@tanstack/react-query';
import { tripApi } from '../services/trip.api';

export const useUpdateTrip = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      tripApi.updateTrip(id, data),
  });

