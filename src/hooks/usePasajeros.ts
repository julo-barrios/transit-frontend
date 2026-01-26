import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pasajerosService } from '../services/pasajeros';
import type { CreatePasajeroPayload, UpdatePasajeroPayload } from '../types';

export const usePasajeros = (search?: string, obra_social_id?: number) => {
    return useQuery({
        queryKey: ['pasajeros', search, obra_social_id],
        queryFn: () => pasajerosService.getAll({ search, obra_social_id }),
    });
};

export const usePasajero = (id: string | number) => {
    return useQuery({
        queryKey: ['pasajero', id],
        queryFn: () => pasajerosService.getById(id),
        enabled: !!id,
    });
};

export const useCreatePasajero = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePasajeroPayload) => pasajerosService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pasajeros'] });
        },
    });
};

export const useUpdatePasajero = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: UpdatePasajeroPayload }) =>
            pasajerosService.update(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pasajeros'] });
            queryClient.invalidateQueries({ queryKey: ['pasajero', variables.id] });
        },
    });
};

export const useDeletePasajero = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => pasajerosService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pasajeros'] });
        },
    });
};
