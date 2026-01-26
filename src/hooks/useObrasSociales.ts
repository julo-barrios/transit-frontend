import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { obrasSocialesService } from '../services/obrasSociales';
import type { CreateObraSocialPayload, UpdateObraSocialPayload } from '../types';

export const useObrasSociales = (search?: string) => {
    return useQuery({
        queryKey: ['obras-sociales', search],
        queryFn: () => obrasSocialesService.getAll(search),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useObraSocial = (id: string | number) => {
    return useQuery({
        queryKey: ['obra-social', id],
        queryFn: () => obrasSocialesService.getById(id),
        enabled: !!id,
    });
};

export const useCreateObraSocial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateObraSocialPayload) => obrasSocialesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['obras-sociales'] });
        },
    });
};

export const useUpdateObraSocial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: UpdateObraSocialPayload }) =>
            obrasSocialesService.update(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['obras-sociales'] });
            queryClient.invalidateQueries({ queryKey: ['obra-social', variables.id] });
        },
    });
};

export const useDeleteObraSocial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => obrasSocialesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['obras-sociales'] });
        },
    });
};
