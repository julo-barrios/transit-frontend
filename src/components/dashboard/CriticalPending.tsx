import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { dashboardService } from "../../services/dashboard";
import PendingItem from "./PendingItem";

export default function CriticalPending() {
    const [pendingItems, setPendingItems] = useState<{ id: number; nombre: string; os: string; periodo: string }[]>([]);

    useEffect(() => {
        dashboardService.getCriticalPending().then(setPendingItems);
    }, []);

    return (
        <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-warning/10" style={{ backgroundColor: 'oklch(80% 0.189 84.429)' }}>
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#800020' }}>
                        <Clock size={16} /> Pendientes de Carga
                    </h3>
                    <span className="badge badge-warning font-black text-[10px]">CRÍTICO</span>
                </div>
            </div>
            <div className="card-body p-5">
                <div className="space-y-3">
                    {pendingItems.map((p) => (
                        <PendingItem key={p.id} item={p} />
                    ))}
                </div>
                <Link to="/pasajeros" className="btn btn-ghost btn-xs btn-block mt-2 opacity-50 font-bold">Ver todos los pasajeros</Link>
            </div>
        </div>
    );
}
