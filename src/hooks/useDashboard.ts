import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard';

export const useDashboardKpis = (period?: string) => {
    return useQuery({
        queryKey: ['dashboard', 'kpis', period],
        queryFn: () => dashboardService.getMetrics(period),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useFinancialEvolution = (months: number = 6) => {
    return useQuery({
        queryKey: ['dashboard', 'financial', months],
        queryFn: () => dashboardService.getFinancialHistory(months),
        staleTime: 1000 * 60 * 10, // 10 minutes (historical data changes less often)
    });
};

export const useWorkload = (period?: string) => {
    return useQuery({
        queryKey: ['dashboard', 'workload', period],
        queryFn: () => dashboardService.getWorkloadStatus(period),
        staleTime: 1000 * 60 * 5,
    });
};

export const usePendingLists = () => {
    const critical = useQuery({
        queryKey: ['dashboard', 'critical_pending'],
        queryFn: () => dashboardService.getCriticalPending(),
    });

    const accreditation = useQuery({
        queryKey: ['dashboard', 'accreditation_pending'],
        queryFn: () => dashboardService.getAccreditationPending(),
    });

    return { critical, accreditation };
};
