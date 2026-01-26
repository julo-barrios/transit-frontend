import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facturasService } from '../services/facturas';
import type { CreateFacturaPayload, UpdateFacturaPayload } from '../types';

export const useFacturas = (filters?: { search?: string; nro_ad?: string; estado?: string; periodo?: string }) => {
    return useQuery({
        queryKey: ['facturas', filters],
        queryFn: () => facturasService.getAll(filters),
    });
};

export const useFactura = (id: string) => {
    return useQuery({
        queryKey: ['factura', id],
        queryFn: () => facturasService.getById(id),
        enabled: !!id,
    });
};

export const useCreateFactura = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateFacturaPayload) => facturasService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facturas'] });
        },
    });
};

export const useUpdateFactura = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateFacturaPayload }) =>
            facturasService.update(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['facturas'] });
            queryClient.invalidateQueries({ queryKey: ['factura', variables.id] });
        },
    });
};

export const useDeleteFactura = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => facturasService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facturas'] });
        },
    });
};
