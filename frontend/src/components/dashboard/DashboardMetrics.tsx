import { Users, TrendingUp, Clock, DollarSign, Wallet } from "lucide-react";
import type { PasajeroListItem } from "../../types";

interface DashboardMetricsProps {
    pasajeros: PasajeroListItem[];
    loading: boolean;
}

export default function DashboardMetrics({ pasajeros, loading }: DashboardMetricsProps) {
    // Mock Data calculations
    const facturasCargadas = 124;
    const objetivoFacturas = 150;
    const porcentajeCargadas = Math.round((facturasCargadas / objetivoFacturas) * 100);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 1. Facturación Estimada (Revenue) - Highlighted */}
            <div className="stats shadow bg-gradient-to-br from-primary to-secondary text-primary-content border-none">
                <div className="stat">
                    <div className="stat-figure text-primary-content/50"><DollarSign size={24} /></div>
                    <div className="stat-title text-primary-content/70 text-xs uppercase font-bold tracking-wider">Facturación Estimada</div>
                    <div className="stat-value text-3xl">$845k</div>
                    <div className="stat-desc text-primary-content/80 font-bold">↗︎ 12% vs mes anterior</div>
                </div>
            </div>

            {/* 2. Pendiente de Cobro (Cash Flow) - Critical */}
            <div className="stats shadow bg-base-100 border border-base-200">
                <div className="stat">
                    <div className="stat-figure text-warning"><Wallet size={24} /></div>
                    <div className="stat-title text-xs uppercase font-bold opacity-60">Pendiente de Cobro</div>
                    <div className="stat-value text-warning">$283k</div>
                    <div className="stat-desc font-medium">Requiere atención</div>
                </div>
            </div>

            {/* 3. Pasajeros Activos - Scale */}
            <div className="stats shadow bg-base-100 border border-base-200">
                <div className="stat">
                    <div className="stat-figure text-secondary"><Users size={24} /></div>
                    <div className="stat-title text-xs uppercase font-bold opacity-60">Pasajeros Activos</div>
                    <div className="stat-value text-secondary">{loading ? "..." : pasajeros.length}</div>
                    <div className="stat-desc">4 nuevos este mes</div>
                </div>
            </div>

            {/* 4. Facturas Cargadas (Productivity) - Circle Widget Hybrid */}
            <div className="stats shadow bg-base-100 border border-base-200 relative overflow-hidden">
                <div className="stat p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="stat-title text-xs uppercase font-bold opacity-60">Facturas Cargadas</div>
                            <div className="stat-value text-2xl">{facturasCargadas}<span className="text-sm opacity-40">/{objetivoFacturas}</span></div>
                            <div className="stat-desc text-success font-bold mt-1">Meta Mensual</div>
                        </div>

                        {/* Circle Progress Mini */}
                        {/* @ts-ignore */}
                        <div className="radial-progress text-success text-[10px] font-bold bg-base-200/50" style={{ "--value": porcentajeCargadas, "--size": "3rem", "--thickness": "4px" } as React.CSSProperties}>
                            {porcentajeCargadas}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
