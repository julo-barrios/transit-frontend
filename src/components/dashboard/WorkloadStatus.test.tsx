import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WorkloadStatus from './WorkloadStatus';
import { dashboardService } from '../../services/dashboard';

// Mock the service
vi.mock('../../services/dashboard', () => ({
    dashboardService: {
        getWorkloadStatus: vi.fn()
    }
}));

// Mock react-router-dom partially if needed, but wrapping in BrowserRouter is usually enough for useNavigate
// However, WorkloadStatus uses useNavigate, so we just need Router context.

describe('WorkloadStatus', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        // Mock a promise that doesn't resolve immediately
        (dashboardService.getWorkloadStatus as any).mockReturnValue(new Promise(() => { }));

        render(
            <BrowserRouter>
                <WorkloadStatus />
            </BrowserRouter>
        );

        // DaisyUI loading spinner has class 'loading-spinner'
        // The component renders: <span className="loading loading-spinner"></span>
        const spinner = screen.getByText((content, element) => {
            return element?.classList.contains('loading-spinner') ?? false;
        });
        expect(spinner).toBeInTheDocument();
    });

    it('renders data after loading', async () => {
        const mockData = [
            { id: 1, nombre: 'OSECAC', completado: 10, total: 20 },
            { id: 2, nombre: 'OSDE', completado: 20, total: 20 }
        ];

        (dashboardService.getWorkloadStatus as any).mockResolvedValue(mockData);

        render(
            <BrowserRouter>
                <WorkloadStatus />
            </BrowserRouter>
        );

        // Wait for the title to appear (it's always there, but data loads in grid)
        expect(screen.getByText('Estado de Carga por Obra Social')).toBeInTheDocument();

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('OSECAC')).toBeInTheDocument();
            expect(screen.getByText('OSDE')).toBeInTheDocument();
        });

        // Check computed values (Faltante logic)
        // 20 total, 10 completed -> 10 missing
        expect(screen.getByText('FALTAN 10')).toBeInTheDocument();
        // 20 total, 20 completed -> COMPLETO
        expect(screen.getByText('COMPLETO')).toBeInTheDocument();
    });
});
