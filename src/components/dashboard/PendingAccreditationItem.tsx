import { Link } from "react-router-dom";
import { calcularDiasTranscurridos } from "../../utils/helpers";
import { useState } from "react";

interface PendingAccreditationItemProps {
    item: {
        id: number;
        letra: string;
        sucursal: number;
        numero: number;
        fecha_factura: string;
        pasajero: {
            nombre: string;
            apellido: string;
            obra_social: string;
        };
    };
    onAccredit: (id: number) => Promise<void>;
}

export default function PendingAccreditationItem({ item, onAccredit }: PendingAccreditationItemProps) {
    const dias = calcularDiasTranscurridos(item.fecha_factura);
    const [loading, setLoading] = useState(false);

    const handleAccredit = async () => {
        setLoading(true);
        await onAccredit(item.id);
        setLoading(false);
    };

    return (
        <div className="p-3 rounded-xl border border-base-200 hover:border-primary/30 transition-all bg-base-50/50 group">
            <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-tight truncate">
                        {item.pasajero.nombre} {item.pasajero.apellido}
                    </p>
                    <p className="text-[10px] opacity-50 font-bold uppercase truncate">
                        {item.letra} {item.sucursal}-{item.numero} • {item.pasajero.obra_social}
                    </p>
                </div>
                <div className="text-right ml-2">
                    <div className={`text-sm font-black ${dias > 45 ? 'text-error' : 'text-primary'} `}>
                        {dias} d.
                    </div>
                    <p className="text-[8px] uppercase opacity-40 font-bold">Desde envío</p>
                </div>
            </div>

            <div className="mt-3 flex gap-2">
                <Link
                    to={`/facturas/${item.id}`}
                    className="btn btn-ghost btn-xs flex-1 text-[10px] font-bold"
                >
                    Ver Factura
                </Link>
                <button
                    onClick={handleAccredit}
                    disabled={loading}
                    className="btn btn-success btn-xs flex-1 text-white text-[10px] font-bold"
                >
                    {loading ? <span className="loading loading-spinner loading-xs"></span> : "Acreditar"}
                </button>
            </div>
        </div>
    );
}
