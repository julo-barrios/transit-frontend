import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import {
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import TableToolbar from "@/components/TableToolbar";
import ObraSocialFilter from "@/components/ObraSocialFilter";
import { MOCK_FACTURAS, MOCK_PASAJEROS } from "@/mocks/Data";
import { facturasService } from "@/services/facturas";
import ConfirmationModal from "@/components/ConfirmationModal";

const Facturas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [osFilter, setOsFilter] = useState("Todas"); // Nuevo estado para Obra Social

  const [facturas, setFacturas] = useState(MOCK_FACTURAS);

  const [confirmationModal, setConfirmationModal] = useState<{ isOpen: boolean; invoiceId: number | null }>({
    isOpen: false,
    invoiceId: null
  });

  const handleAcreditar = (id: number) => {
    setConfirmationModal({ isOpen: true, invoiceId: id });
  };

  const confirmAccreditation = async () => {
    if (!confirmationModal.invoiceId) return;
    const id = confirmationModal.invoiceId;

    try {
      await facturasService.update(id, { acreditada: true });
      const fechaHoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      setFacturas(prev => prev.map(f =>
        f.id === id
          ? { ...f, acreditada: true, fecha_acreditacion: fechaHoy }
          : f
      ));
    } catch (error) {
      console.error("Error al acreditar factura:", error);
      alert("Hubo un error al acreditar la factura.");
    }
  };

  // Lógica de filtrado avanzada
  const facturasFiltradas = facturas.filter(f => {
    // Buscamos el pasajero para obtener su nombre y su obra social
    const pasajero = MOCK_PASAJEROS.find(p => p.numero_ad.toString() === f.nro_ad);
    const nombreCompleto = `${pasajero?.nombre} ${pasajero?.apellido} `.toLowerCase();
    const nombreOS = pasajero?.obra_social?.nombre || "Sin OS";

    const matchesSearch = nombreCompleto.includes(searchTerm.toLowerCase()) || f.numero.includes(searchTerm);
    const matchesStatus = statusFilter === "Todos" || f.estado === statusFilter;
    const matchesOS = osFilter === "Todas" || nombreOS === osFilter; // Condición de Obra Social

    return matchesSearch && matchesStatus && matchesOS;
  });

  const renderStatusBadge = (estado: string) => {
    switch (estado) {
      case "Enviada":
        return <span className="badge badge-success badge-outline gap-1 font-bold text-xs"><CheckCircle2 size={12} /> ENVIADA</span>;
      case "Procesando ARCA":
        return <span className="badge badge-warning badge-outline gap-1 font-bold text-xs"><Clock size={12} /> PROCESANDO</span>;
      case "Error":
        return <span className="badge badge-error badge-outline gap-1 font-bold text-xs"><AlertCircle size={12} /> ERROR</span>;
      default:
        return <span className="badge badge-ghost badge-outline gap-1 font-bold text-xs">{estado}</span>;
    }
  };

  return (
    <PageLayout
      title="Gestión de Facturas"
      breadcrumbs={["Inicio", "Facturas"]}
      action={
        <Link to="/facturas/nueva" className="btn btn-primary btn-sm gap-2 shadow-lg shadow-primary/20">
          <Plus size={16} /> Nueva Factura
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Barra de Herramientas Mejorada */}
        {/* Barra de Herramientas Mejorada */}
        <TableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Buscar por pasajero o N° factura..."
        >
          {/* Filtro Obra Social (NUEVO) */}
          <ObraSocialFilter value={osFilter} onChange={setOsFilter} />

          {/* Filtro Estado */}
          <div className="flex items-center gap-2 bg-base-100 px-3 py-1 rounded-lg border border-base-300">
            <Filter size={16} className="opacity-50" />
            <select
              className="select select-ghost select-sm focus:bg-transparent font-medium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Enviada">Enviadas</option>
              <option value="Procesando ARCA">En Proceso</option>
              <option value="Error">Con Error</option>
            </select>
          </div>
        </TableToolbar>

        {/* Tabla de Facturas */}
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200/50">
              <tr className="text-xs uppercase opacity-60">
                <th>N° Factura / Letra</th>
                <th>Pasajero / Obra Social</th>
                <th>Periodo / KM</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturasFiltradas.map((f) => {
                const pasajero = MOCK_PASAJEROS.find(p => p.numero_ad.toString() === f.nro_ad);
                return (
                  <tr key={f.id} className="hover:bg-base-200/40 transition-colors">
                    <td>
                      <div className="font-bold">{f.letra} {f.sucursal}-{f.numero}</div>
                      <div className="text-[10px] opacity-50 font-mono italic">CAI: {f.cai}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary/10 text-primary rounded-full w-8 font-bold">
                            <span className="text-[10px]">{pasajero?.nombre[0]}{pasajero?.apellido[0]}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{pasajero?.nombre} {pasajero?.apellido}</div>
                          <div className="text-[10px] font-bold text-primary uppercase">{pasajero?.obra_social?.nombre || "OSECAC"}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm font-medium">{f.periodo_desde}</div>
                      <div className="text-[10px] opacity-60">{f.kilometros} KM recorridos</div>
                    </td>
                    <td>
                      <div className="font-black text-primary italic">
                        ${f.importe_total.toLocaleString('es-AR')}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1 items-start">
                        {renderStatusBadge(f.estado)}
                        {f.acreditada && (
                          <div className="badge badge-success badge-xs gap-1 text-[10px] font-bold text-white">
                            <CheckCircle2 size={10} /> PAGADA
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        {/* Botón de Acreditación */}
                        {!f.acreditada && f.estado === "Enviada" && (
                          <button
                            className="btn btn-success btn-xs gap-1 text-white shadow-sm mr-2"
                            title="Marcar como acreditada"
                            onClick={() => handleAcreditar(f.id)}
                          >
                            <CheckCircle2 size={12} /> Acreditar
                          </button>
                        )}

                        <Link to={`/facturas/${f.id}`} className="btn btn-ghost btn-xs btn-square hover:text-primary" title="Ver Detalles">
                          <Eye size={16} />
                        </Link>

                        <a
                          href={f.pdf_path}
                          className={`btn btn-ghost btn-xs btn-square ${!f.pdf_path ? 'btn-disabled opacity-20' : ''}`}
                          title="Descargar PDF"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {facturasFiltradas.length === 0 && (
            <div className="py-20 text-center opacity-30">
              <Building2 size={48} className="mx-auto mb-2" />
              <p className="font-medium">No hay facturas que coincidan con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, invoiceId: null })}
        onConfirm={confirmAccreditation}
        title="Confirmar Acreditación"
        message="¿Estás seguro de que deseas marcar esta factura como acreditada? Esta acción no se puede deshacer."
      />
    </PageLayout>
  );
};

export default Facturas;