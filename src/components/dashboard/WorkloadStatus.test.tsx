import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WorkloadStatus from './WorkloadStatus';
import { useWorkload } from '../../hooks/useDashboard';

// Mock the hook
vi.mock('../../hooks/useDashboard', () => ({
    useWorkload: vi.fn(),
    usePendingLists: vi.fn()
}));

describe('WorkloadStatus', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        // Mock loading state
        vi.mocked(useWorkload).mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            error: null,
            isPending: true,
            status: 'pending',
            fetchStatus: 'fetching'
        } as any);

        render(
            <BrowserRouter>
                <WorkloadStatus />
            </BrowserRouter>
        );

        const spinner = screen.getByText((_, element) => {
            return element?.classList.contains('loading-spinner') ?? false;
        });
        expect(spinner).toBeInTheDocument();
    });

    it('renders data after loading', async () => {
        const mockData = [
            { id: 1, nombre: 'OSECAC', completado: 10, total: 20 },
            { id: 2, nombre: 'OSDE', completado: 20, total: 20 }
        ];

        // Mock success state
        vi.mocked(useWorkload).mockReturnValue({
            data: mockData,
            isLoading: false,
            isError: false,
            error: null,
            isPending: false,
            status: 'success',
            fetchStatus: 'idle'
        } as any);

        render(
            <BrowserRouter>
                <WorkloadStatus />
            </BrowserRouter>
        );

        expect(screen.getByText('Estado de Carga por Obra Social')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('OSECAC')).toBeInTheDocument();
            expect(screen.getByText('OSDE')).toBeInTheDocument();
        });

        expect(screen.getByText('FALTAN 10')).toBeInTheDocument();
        expect(screen.getByText('COMPLETO')).toBeInTheDocument();
    });
});
