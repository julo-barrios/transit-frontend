import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, CalendarDays } from "lucide-react";
import { dashboardService } from "../../services/dashboard";

export default function WorkloadStatus() {
    const navigate = useNavigate();
    const [periodoEstadoCarga, setPeriodoEstadoCarga] = useState("2023-12");
    const [statsObrasSociales, setStatsObrasSociales] = useState<any[]>([]); // Using any for fast iteration on mocks
    const [loading, setLoading] = useState(true);

    const opcionesPeriodos = [
        { value: "2023-12", label: "Diciembre 2023" },
        { value: "2023-11", label: "Noviembre 2023" },
        { value: "2023-10", label: "Octubre 2023" },
    ];

    useEffect(() => {
        const loadStats = async () => {
            try {
                // In a real app we would pass the period to the service
                const data = await dashboardService.getWorkloadStatus();
                // Map the simple service data to the UI needs (calculating colors etc)
                const processed = data.map((item: any) => {
                    const faltantes = item.total - item.completado;
                    return {
                        ...item,
                        faltante: faltantes,
                        color: faltantes > 0 ? (faltantes > 2 ? "progress-error" : "progress-warning") : "progress-success"
                    };
                });
                setStatsObrasSociales(processed);
            } catch (error) {
                console.error("Error loading workload:", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, [periodoEstadoCarga]);

    return (
        <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Building2 size={20} className="text-primary" />
                        Estado de Carga por Obra Social
                    </h3>

                    <div className="flex items-center gap-2 bg-base-200/50 border border-base-300 rounded-xl px-3 py-1.5 transition-all hover:bg-base-200">
                        <CalendarDays size={14} className="text-primary" />
                        <select
                            className="select select-ghost select-xs font-black focus:bg-transparent"
                            value={periodoEstadoCarga}
                            onChange={(e) => setPeriodoEstadoCarga(e.target.value)}
                        >
                            {opcionesPeriodos.map(op => (
                                <option key={op.value} value={op.value}>{op.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? <div className="col-span-3 text-center py-8"><span className="loading loading-spinner"></span></div> : statsObrasSociales.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-2xl border border-base-200 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer bg-base-50/30 group"
                            onClick={() => navigate(`/facturas/nueva?obraSocial=${encodeURIComponent(item.nombre)}`)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black uppercase opacity-60 group-hover:text-primary">{item.nombre}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.faltante === 0 ? 'bg-success/20 text-success' : 'bg-error/10 text-error'}`}>
                                    {item.faltante === 0 ? 'COMPLETO' : `FALTAN ${item.faltante}`}
                                </span>
                            </div>
                            <p className="text-xl font-black mb-1">{item.completado} <span className="text-xs font-normal opacity-40">/ {item.total}</span></p>
                            <progress className={`progress ${item.color} w-full h-1.5`} value={item.completado} max={item.total}></progress>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
