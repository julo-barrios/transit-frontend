
import api from "@/api/axios";
import type { DashboardMetricsData } from "../components/dashboard/DashboardMetrics";
import type { AccreditationPendingItem, WorkloadItem } from "../types";

interface RawWorkloadItem {
    social_work_id: number;
    name: string;
    loaded_count: number;
    total_passengers: number;
}

interface RawFinancialItem {
    period: string;
    amount: number;
    accredited_amount?: number;
}

interface RawInvoiceItem {
    id: number;
    updated_at: string;
    created_at: string;
    letter?: string;
    branch?: string;
    number: string;
    passenger?: {
        full_name?: string;
        first_name?: string;
        last_name?: string;
    };
    social_work?: {
        name: string;
    };
}

export const dashboardService = {
    getMetrics: async (period?: string): Promise<DashboardMetricsData> => {
        try {
            const { data } = await api.get('/dashboard/kpis', { params: { period } });

            return {
                estimatedRevenue: data.estimated_revenue,
                pendingCollection: data.pending_collection,
                activePassengers: data.active_passengers,
                invoicesStatus: {
                    loaded: data.invoices_loaded,
                    goal: data.invoices_target
                }
            };
        } catch (error) {
            console.error("Error fetching dashboard metrics:", error);
            throw error;
        }
    },

    getWorkloadStatus: async (period?: string): Promise<WorkloadItem[]> => {
        try {
            const { data } = await api.get('/dashboard/workload', { params: { period } });

            // Map API response to UI type if key names differ
            return (data || []).map((item: RawWorkloadItem) => ({
                id: item.social_work_id,
                nombre: item.name,
                completado: item.loaded_count,
                total: item.total_passengers
            }));
        } catch (error) {
            console.error("Error fetching workload:", error);
            throw error;
        }
    },

    getFinancialHistory: async (months: number = 6) => {
        try {
            const { data } = await api.get('/dashboard/financial-evolution', { params: { months } });

            // Map API response [ { period: '2023-10', amount: 980000 } ] 
            // to UI format [ { name: 'Oct', facturado: 980000, acreditado: 0 } ]
            // Note: 'acreditado' might need another endpoint or field if available. 
            // For now mapping 'amount' to 'facturado'.
            return (data || []).map((item: RawFinancialItem) => {
                const date = new Date(item.period + '-01'); // Force YYYY-MM-01
                const monthName = date.toLocaleString('es-ES', { month: 'short' });
                const name = monthName.charAt(0).toUpperCase() + monthName.slice(1);

                return {
                    name: name,
                    facturado: item.amount,
                    acreditado: item.accredited_amount || 0 // Assuming API might provide this or default to 0
                };
            });
        } catch (error) {
            console.error("Error fetching financial evolution:", error);
            throw error;
        }
    },

    getCriticalPending: async () => {
        try {
            const { data } = await api.get('/dashboard/invoices', {
                params: {
                    status: 'Error',
                    limit: 5,
                    sort: 'updated_at:desc'
                }
            });

            return (data || []).map((item: RawInvoiceItem) => ({
                id: item.id,
                nombre: item.passenger?.full_name || 'Desconocido',
                os: item.social_work?.name || 'S/D', // Depending on API structure
                periodo: new Date(item.updated_at).toLocaleDateString() // Or logic to show period
            }));
        } catch (error) {
            console.error("Error fetching critical pending:", error);
            throw error;
        }
    },

    getAccreditationPending: async (): Promise<AccreditationPendingItem[]> => {
        try {
            const { data } = await api.get('/dashboard/invoices', {
                params: {
                    status: 'Enviada',
                    accredited: 'false',
                    limit: 5,
                    sort: 'created_at:asc'
                }
            });

            return (data || []).map((f: RawInvoiceItem) => ({
                id: f.id,
                letra: f.letter || 'A', // Assuming API provides letter
                sucursal: f.branch || '0001',
                numero: f.number.split('-')[1] || f.number,
                fecha_factura: f.created_at, // or issue_date
                pasajero: {
                    nombre: f.passenger?.first_name || "Desconocido",
                    apellido: f.passenger?.last_name || "",
                    obra_social: f.social_work?.name || "S/D"
                }
            }));
        } catch (error) {
            console.error("Error fetching accreditation pending:", error);
            throw error;
        }
    }
};
