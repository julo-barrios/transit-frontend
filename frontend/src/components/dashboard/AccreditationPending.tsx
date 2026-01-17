import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { MOCK_PASAJEROS, MOCK_FACTURAS } from "../../mocks/Data";
import { calcularDiasTranscurridos } from "../../utils/helpers";

export default function AccreditationPending() {
    const facturasPendientesCobro = MOCK_FACTURAS.filter(f => f.estado === "Enviada" && !f.acreditada)
        .sort((a, b) => new Date(a.fecha_factura).getTime() - new Date(b.fecha_factura).getTime());

    return (
        <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
            <div className="bg-success/10 px-5 py-3 border-b border-success/10 flex justify-between items-center">
                <h3 className="font-bold text-sm flex items-center gap-2 text-success-content">
                    <CheckCircle2 size={16} /> Pendiente Acreditación
                </h3>
                <span className="badge badge-success font-black text-[10px]">{facturasPendientesCobro.length} FACTURAS</span>
            </div>

            <div className="card-body p-5">
                <div className="space-y-3">
                    {facturasPendientesCobro.length > 0 ? (
                        facturasPendientesCobro.map((f) => {
                            const pasajero = MOCK_PASAJEROS.find(p => p.numero_ad.toString() === f.nro_ad);
                            const dias = calcularDiasTranscurridos(f.fecha_factura);

                            return (
                                <div key={f.id} className="p-3 rounded-xl border border-base-200 hover:border-primary/30 transition-all bg-base-50/50 group">
                                    <div className="flex justify-between items-start">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold leading-tight truncate">
                                                {pasajero?.nombre} {pasajero?.apellido}
                                            </p>
                                            <p className="text-[10px] opacity-50 font-bold uppercase truncate">
                                                {f.letra} {f.sucursal}-{f.numero} • {pasajero?.obra_social?.nombre}
                                            </p>
                                        </div>
                                        <div className="text-right ml-2">
                                            <div className={`text-sm font-black ${dias > 45 ? 'text-error' : 'text-primary'}`}>
                                                {dias} d.
                                            </div>
                                            <p className="text-[8px] uppercase opacity-40 font-bold">Desde envío</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex gap-2">
                                        <Link
                                            to="/facturas"
                                            className="btn btn-ghost btn-xs flex-1 text-[10px] font-bold"
                                        >
                                            Ver Factura
                                        </Link>
                                        <button className="btn btn-success btn-xs flex-1 text-white text-[10px] font-bold">
                                            Acreditar
                                        </button>
                                    </div>
                                </div>
                            );
                        })
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
