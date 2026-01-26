import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../components/Layout/PageLayout";
import {
    ArrowLeft,
    FileText,
    Calendar,
    CreditCard,
    CheckCircle2,
    Clock,
    AlertCircle,
    Building2,
    Download
} from "lucide-react";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useFactura, useUpdateFactura } from "@/hooks/useFacturas";
import { usePasajeros } from "@/hooks/usePasajeros";

const FacturaDetalle = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch Factura
    const { data: factura, isLoading: loadingFactura } = useFactura(id!);

    // Fetch Pasajeros for name lookup
    const { data: pasajeros = [] } = usePasajeros();

    // Mutations
    const updateMutation = useUpdateFactura();

    const [showConfirmation, setShowConfirmation] = useState(false);

    // Derived State
    const pasajero = factura
        ? pasajeros.find(p => p.identificador_os.toString() === factura.identificador_os)
        : null;

    const renderStatusBadge = (estado: string) => {
        switch (estado) {
            case "Enviada": return <span className="badge badge-success badge-lg gap-2 text-white"><CheckCircle2 size={16} /> Enviada a OS</span>;
            case "Procesando ARCA": return <span className="badge badge-warning badge-lg gap-2"><Clock size={16} /> Procesando ARCA</span>;
            case "Error": return <span className="badge badge-error badge-lg gap-2 text-white"><AlertCircle size={16} /> Error</span>;
            default: return <span className="badge badge-ghost badge-lg gap-2">{estado}</span>;
        }
    };

    const handleAccredit = () => {
        setShowConfirmation(true);
    };

    const confirmAccreditation = async () => {
        if (!factura) return;
        try {
            updateMutation.mutate({
                id: factura.id,
                data: {
                    acreditada: true,
                    fecha_acreditacion: new Date().toISOString().split('T')[0]
                }
            });
            setShowConfirmation(false);
        } catch (error) {
            console.error("Error al acreditar:", error);
        }
    };

    if (loadingFactura) return <div className="p-8 text-center"><span className="loading loading-spinner loading-lg"></span></div>;

    if (!factura) {
        return (
            <PageLayout title="Detalle de Factura" breadcrumbs={[
                { label: "Inicio", path: "/" },
                { label: "Facturas", path: "/facturas" },
                { label: "Detalle", path: "/facturas" }
            ]}>
                <div className="flex flex-col items-center justify-center h-64 opacity-50">
                    <FileText size={48} className="mb-4" />
                    <p>Factura no encontrada</p>
                    <button onClick={() => navigate("/facturas")} className="btn btn-ghost mt-4">Volver</button>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            title={`Factura ${factura.letra} ${factura.sucursal}-${factura.numero}`}
            breadcrumbs={[
                { label: "Inicio", path: "/" },
                { label: "Facturas", path: "/facturas" },
                { label: `${factura.letra}-${factura.numero}`, path: `/facturas/${factura.id}` }
            ]}
            action={
                <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm gap-2">
                    <ArrowLeft size={16} /> Volver
                </button>
            }
        >
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Status */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black">Factura {factura.letra} <span className="opacity-50">{factura.sucursal}-{factura.numero}</span></h2>
                            {factura.acreditada && <span className="badge badge-primary font-bold">PAGADA</span>}
                        </div>
                        <p className="text-sm opacity-60 font-mono">CAI: {factura.cai} • Vto: {factura.fecha_cai}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {renderStatusBadge(factura.estado)}

                        {!factura.acreditada && factura.estado === "Enviada" && (
                            <button
                                onClick={handleAccredit}
                                className="btn btn-success btn-sm text-white font-bold gap-2"
                            >
                                <CheckCircle2 size={16} /> Acreditar
                            </button>
                        )}

                        {/* Mock Download Button - No PDF generation */}
                        <a
                            href={factura.pdf_path}
                            target="_blank"
                            rel="noreferrer"
                            className={`btn btn-square btn-ghost border border-base-300 ${!factura.pdf_path ? 'btn-disabled opacity-50' : ''}`}
                            title="Descargar PDF"
                        >
                            <Download size={20} />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Columna Izquierda: Datos Principales */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Tarjeta de Importes */}
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body">
                                <h3 className="card-title text-sm uppercase opacity-50 mb-4 flex items-center gap-2">
                                    <CreditCard size={16} /> Detalles Económicos
                                </h3>

                                <div className="grid grid-cols-1 gap-8">
                                    <div>
                                        <p className="text-xs font-bold uppercase opacity-50 mb-1">Total Facturado</p>
                                        <p className="text-4xl font-black text-primary">${Number(factura.importe_total).toLocaleString('es-AR')}</p>
                                    </div>
                                </div>

                                <div className="divider my-4"></div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="opacity-70">Periodo Facturado:</p>
                                        <p className="font-bold flex items-center gap-2"><Calendar size={14} /> {factura.periodo_desde}</p>
                                    </div>
                                    <div>
                                        <p className="opacity-70">Fecha de Emisión:</p>
                                        <p className="font-bold">{factura.fecha_factura}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta del Pasajero */}
                        {pasajero && (
                            <div className="card bg-base-100 shadow-xl border border-base-200">
                                <div className="card-body">
                                    <h3 className="card-title text-sm uppercase opacity-50 mb-4 flex items-center gap-2">
                                        <Building2 size={16} /> Datos del Cliente / Obra Social
                                    </h3>

                                    <div className="flex items-start gap-4">
                                        <div className="avatar placeholder">
                                            <div className="bg-primary text-primary-content rounded-full w-12 text-xl font-bold">
                                                <span>{pasajero.nombre[0]}{pasajero.apellido[0]}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold">{pasajero.nombre} {pasajero.apellido}</h4>
                                            <p className="text-sm opacity-70 mb-2">CUIL: {pasajero.cuil}</p>
                                            <div className="badge badge-outline gap-2">
                                                <Building2 size={12} />
                                                {pasajero.obra_social && typeof pasajero.obra_social !== 'string'
                                                    ? pasajero.obra_social.nombre
                                                    : (typeof pasajero.obra_social === 'string' ? pasajero.obra_social : "OSECAC")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Columna Derecha: Timeline (Mock) */}
                    <div className="space-y-6">
                        <div className="card bg-base-100 shadow border border-base-200">
                            <div className="card-body p-6">
                                <h3 className="font-bold mb-4">Historial de Eventos</h3>
                                <ul className="steps steps-vertical text-sm">
                                    <li className="step step-primary">Peticion de factura ({factura.fecha_factura})</li>
                                    <li className="step step-primary">Factura generada</li>
                                    <li className="step step-primary">Envío a {
                                        pasajero?.obra_social && typeof pasajero.obra_social !== 'string'
                                            ? pasajero.obra_social.nombre
                                            : (typeof pasajero?.obra_social === 'string' ? pasajero.obra_social : "OS")
                                    }</li>
                                    <li className={`step ${factura.acreditada ? 'step-primary' : ''}`}>
                                        {factura.acreditada ? `Acreditada (${factura.fecha_acreditacion})` : "Pendiente de Pago"}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={confirmAccreditation}
                title="Confirmar Acreditación"
                message="¿Estás seguro de que deseas marcar esta factura como acreditada?"
            />
        </PageLayout>
    );
};

export default FacturaDetalle;
