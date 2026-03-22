import { useMutation } from '@tanstack/react-query';
import { tripApi } from '../services/trip.api';

export const useCreateTrip = () =>
  useMutation({
    mutationFn: tripApi.createTrip,
  });

