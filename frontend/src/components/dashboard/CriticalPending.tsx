import { Link } from "react-router-dom";
import { Clock, Plus } from "lucide-react";

export default function CriticalPending() {
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
                    {[
                        { id: 101, nombre: "Julian Barrios", os: "OSECAC", periodo: "Dic 2023" },
                        { id: 102, nombre: "Marta Rodriguez", os: "OSDE", periodo: "Dic 2023" },
                        { id: 103, nombre: "Ricardo Darín", os: "PAMI", periodo: "Nov 2023" },
                    ].map((p) => (
                        <div key={p.id} className="p-3 rounded-xl border border-base-200 hover:border-primary/30 transition-all bg-base-50/50 group">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-sm font-bold leading-tight">{p.nombre}</p>
                                    <p className="text-[10px] opacity-50 font-bold uppercase">{p.os}</p>
                                </div>
                                <span className="text-[10px] font-black text-warning bg-warning/10 px-2 py-0.5 rounded">FALTA {p.periodo}</span>
                            </div>
                            <Link to={`/pasajeros/${p.id}/facturas/nueva`} className="btn btn-primary btn-xs btn-block gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus size={12} /> Cargar Planilla
                            </Link>
                        </div>
                    ))}
                </div>
                <Link to="/pasajeros" className="btn btn-ghost btn-xs btn-block mt-2 opacity-50 font-bold">Ver todos los pasajeros</Link>
            </div>
        </div>
    );
}
