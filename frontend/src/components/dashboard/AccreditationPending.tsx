
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { dashboardService } from "../../services/dashboard";
import PendingAccreditationItem from "./PendingAccreditationItem";

export default function AccreditationPending() {
    const [facturasPendientesCobro, setFacturasPendientesCobro] = useState<any[]>([]);

    useEffect(() => {
        dashboardService.getAccreditationPending().then(setFacturasPendientesCobro);
    }, []);

    return (
        <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
            <div className="bg-error/10 px-5 py-3 border-b border-error/10 flex justify-between items-center">
                <h3 className="font-bold text-sm flex items-center gap-2 text-error">
                    <AlertCircle size={16} /> Pendiente Acreditación
                </h3>
                <span className="badge badge-error font-black text-[10px] text-white">{facturasPendientesCobro.length} FACTURAS</span>
            </div>

            <div className="card-body p-5">
                <div className="space-y-3">
                    {facturasPendientesCobro.length > 0 ? (
                        facturasPendientesCobro.map((f) => (
                            <PendingAccreditationItem key={f.id} item={f} />
                        ))
                    ) : (
                        <div className="text-center py-6 opacity-40">
                            <p className="text-xs font-bold italic">No hay cobros pendientes</p>
                        </div>
                    )}
                </div>

                <Link to="/facturas" className="btn btn-ghost btn-xs btn-block mt-2 opacity-50 font-bold uppercase tracking-wider">
                    Ver historial de pagos
                </Link>
            </div>
        </div>
    );
}
