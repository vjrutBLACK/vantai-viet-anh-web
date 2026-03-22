import { useMutation } from '@tanstack/react-query';
import { tripApi } from '../services/trip.api';

export const useAssignTrip = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: { vehicleId: string; driverId: string } }) =>
      tripApi.assignTrip(id, data),
  });

