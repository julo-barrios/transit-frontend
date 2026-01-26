import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export interface PendingItemData {
    id: number;
    nombre: string;
    os: string;
    periodo: string;
}

interface PendingItemProps {
    item: PendingItemData;
}

export default function PendingItem({ item }: PendingItemProps) {
    return (
        <div className="p-3 rounded-xl border border-base-200 hover:border-primary/30 transition-all bg-base-50/50 group">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-sm font-bold leading-tight">{item.nombre}</p>
                    <p className="text-[10px] opacity-50 font-bold uppercase">{item.os}</p>
                </div>
                <span className="text-[10px] font-black text-warning bg-warning/10 px-2 py-0.5 rounded">FALTA {item.periodo}</span>
            </div>
            <Link to={`/pasajeros/${item.id}/facturas/nueva?periodo=${item.periodo.replace(" ", "")}`} className="btn btn-primary btn-xs btn-block gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus size={12} /> Cargar Planilla
            </Link>
        </div>
    );
}
