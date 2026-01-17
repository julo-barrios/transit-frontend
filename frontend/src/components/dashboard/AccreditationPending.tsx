
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { dashboardService } from "../../services/dashboard";
import { facturasService } from "../../services/facturas";
import PendingAccreditationItem from "./PendingAccreditationItem";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function AccreditationPending() {
    const [facturasPendientesCobro, setFacturasPendientesCobro] = useState<any[]>([]);
    const [confirmationModal, setConfirmationModal] = useState<{ isOpen: boolean; invoiceId: number | null }>({
        isOpen: false,
        invoiceId: null
    });

    useEffect(() => {
        dashboardService.getAccreditationPending().then(setFacturasPendientesCobro);
    }, []);

    const handleAccredit = (id: number) => {
        console.log("Opening modal for invoice:", id);
        setConfirmationModal({ isOpen: true, invoiceId: id });
    };

    const confirmAccreditation = async () => {
        if (!confirmationModal.invoiceId) return;
        const id = confirmationModal.invoiceId;

        try {
            await facturasService.update(id, { acreditada: true });
            // Remove from list optimistically or re-fetch
            setFacturasPendientesCobro(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error("Failed to accredit invoice", error);
        }
    };

    return (
        <>
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
                                <PendingAccreditationItem key={f.id} item={f} onAccredit={async (id) => handleAccredit(id)} />
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

            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={() => setConfirmationModal({ isOpen: false, invoiceId: null })}
                onConfirm={confirmAccreditation}
                title="Confirmar Acreditación"
                message="¿Estás seguro de que deseas marcar esta factura como acreditada?"
            />
        </>
    );
}
