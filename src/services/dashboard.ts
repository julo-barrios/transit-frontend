
import { MOCK_PASAJEROS, MOCK_FACTURAS, MOCK_OBRAS_SOCIALES } from "../mocks/Data";
import type { AccreditationPendingItem, WorkloadItem } from "../types";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
    getMetrics: async () => {
        await delay(300);

        // Calculate real numbers from mocks
        const activePassengers = MOCK_PASAJEROS.length;
        const estimatedRevenue = MOCK_FACTURAS.reduce((sum, f) => sum + f.importe_total, 0);
        const pendingCollection = MOCK_FACTURAS.filter(f => !f.acreditada).reduce((sum, f) => sum + f.importe_total, 0);

        const facturasCargadas = MOCK_FACTURAS.filter(f => f.periodo_desde === "2023-12").length; // Example logic
        const goal = 150; // Hardcoded goal for now

        return {
            activePassengers,
            estimatedRevenue,
            pendingCollection,
            invoicesStatus: {
                loaded: facturasCargadas,
                goal: goal
            }
        };
    },

    getWorkloadStatus: async (): Promise<WorkloadItem[]> => {
        await delay(300);
        // Use the logic that was in WorkloadStatus.tsx
        const stats = MOCK_OBRAS_SOCIALES.map(os => {
            // Logic simplified for mock service
            return {
                id: os.id,
                nombre: os.nombre,
                completado: Math.floor(Math.random() * 20),
                total: 20
            };
        });
        return stats;
    },

    getFinancialHistory: async () => {
        await delay(300);
        return [
            { name: 'Ago', facturado: 85000, acreditado: 85000 },
            { name: 'Sep', facturado: 92000, acreditado: 92000 },
            { name: 'Oct', facturado: 75000, acreditado: 50000 },
            { name: 'Nov', facturado: 110000, acreditado: 10000 },
            { name: 'Dic', facturado: 98000, acreditado: 98000 },
        ];
    },

    getCriticalPending: async () => {
        await delay(300);
        return [
            { id: 101, nombre: "Julian Barrios", os: "OSECAC", periodo: "Dic 2023" },
            { id: 102, nombre: "Marta Rodriguez", os: "OSDE", periodo: "Dic 2023" },
            { id: 103, nombre: "Ricardo Darín", os: "PAMI", periodo: "Nov 2023" },
        ];
    },

    getAccreditationPending: async (): Promise<AccreditationPendingItem[]> => {
        await delay(300);
        const facturasPendientes = MOCK_FACTURAS.filter(f => f.estado === "Enviada" && !f.acreditada)
            .sort((a, b) => new Date(a.fecha_factura).getTime() - new Date(b.fecha_factura).getTime());

        return facturasPendientes.map(f => {
            const pasajero = MOCK_PASAJEROS.find(p => p.numero_ad.toString() === f.nro_ad);
            return {
                id: f.id,
                letra: f.letra,
                sucursal: f.sucursal,
                numero: f.numero,
                fecha_factura: f.fecha_factura,
                pasajero: {
                    nombre: pasajero?.nombre || "Desconocido",
                    apellido: pasajero?.apellido || "",
                    obra_social: pasajero?.obra_social?.nombre || "S/D"
                }
            };
        });
    }
};
