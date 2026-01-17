import { Users, TrendingUp, Clock } from "lucide-react";
import type { PasajeroListItem } from "../../types";

interface DashboardMetricsProps {
    pasajeros: PasajeroListItem[];
    loading: boolean;
}

export default function DashboardMetrics({ pasajeros, loading }: DashboardMetricsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stats shadow bg-base-100 border border-base-200">
                <div className="stat">
                    <div className="stat-figure text-primary"><Users size={24} /></div>
                    <div className="stat-title text-xs uppercase font-semibold tracking-wider">Total Pasajeros</div>
                    <div className="stat-value text-primary">{loading ? "..." : pasajeros.length}</div>
                    <div className="stat-desc text-success font-bold">↗︎ 4 este mes</div>
                </div>
            </div>
            <div className="stats shadow bg-base-100 border border-base-200">
                <div className="stat">
                    <div className="stat-title text-xs uppercase font-bold opacity-60">Facturación Pendiente</div>
                    <div className="stat-value text-2xl text-secondary">$283k</div>
                    <div className="stat-desc">Total sin acreditar</div>
                </div>
            </div>

            <div className="stats shadow bg-base-100 border border-base-200">
                <div className="stat">
                    <div className="stat-figure text-success"><TrendingUp size={24} /></div>
                    <div className="stat-title text-xs uppercase font-semibold tracking-wider">Facturado Mes</div>
                    <div className="stat-value text-success">$425k</div>
                    <div className="stat-desc text-success font-bold">Corte: 20 Dic</div>
                </div>
            </div>

            <div className="stats shadow bg-base-100 border border-base-200">
                <div className="stat">
                    <div className="stat-figure text-warning"><Clock size={24} /></div>
                    <div className="stat-title text-xs uppercase font-semibold tracking-wider">Días p/ Cobro</div>
                    <div className="stat-value text-warning">45d</div>
                    <div className="stat-desc font-bold">Promedio histórico</div>
                </div>
            </div>
        </div>
    );
}
