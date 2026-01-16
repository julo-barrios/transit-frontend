import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import { 
  FileText, 
  Search, 
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
import { MOCK_FACTURAS, MOCK_PASAJEROS, MOCK_OBRAS_SOCIALES } from "../../mocks/Data";

const Facturas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [osFilter, setOsFilter] = useState("Todas"); // Nuevo estado para Obra Social
  
  const [facturas] = useState(MOCK_FACTURAS);

  // Lógica de filtrado avanzada
  const facturasFiltradas = facturas.filter(f => {
    // Buscamos el pasajero para obtener su nombre y su obra social
    const pasajero = MOCK_PASAJEROS.find(p => p.numero_ad.toString() === f.nro_ad);
    const nombreCompleto = `${pasajero?.nombre} ${pasajero?.apellido}`.toLowerCase();
    const nombreOS = pasajero?.obra_social?.nombre || "Sin OS";
    
    const matchesSearch = nombreCompleto.includes(searchTerm.toLowerCase()) || f.numero.includes(searchTerm);
    const matchesStatus = statusFilter === "Todos" || f.estado === statusFilter;
    const matchesOS = osFilter === "Todas" || nombreOS === osFilter; // Condición de Obra Social
    
    return matchesSearch && matchesStatus && matchesOS;
  });

  const renderStatusBadge = (estado: string) => {
    switch (estado) {
      case "Enviada":
        return <span className="badge badge-success badge-outline gap-1 font-bold text-xs"><CheckCircle2 size={12}/> ENVIADA</span>;
      case "Procesando ARCA":
        return <span className="badge badge-warning badge-outline gap-1 font-bold text-xs"><Clock size={12}/> PROCESANDO</span>;
      case "Error":
        return <span className="badge badge-error badge-outline gap-1 font-bold text-xs"><AlertCircle size={12}/> ERROR</span>;
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
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-base-200/30 p-4 rounded-xl border border-base-200">
          {/* Buscador */}
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por pasajero o N° factura..." 
              className="input input-bordered w-full pl-10 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            {/* Filtro Obra Social (NUEVO) */}
            <div className="flex items-center gap-2 bg-base-100 px-3 py-1 rounded-lg border border-base-300">
              <Building2 size={16} className="opacity-50 text-primary" />
              <select 
                className="select select-ghost select-sm focus:bg-transparent font-medium"
                value={osFilter}
                onChange={(e) => setOsFilter(e.target.value)}
              >
                <option value="Todas">Todas las Obras Sociales</option>
                {MOCK_OBRAS_SOCIALES.map(os => (
                  <option key={os.id} value={os.nombre}>{os.nombre}</option>
                ))}
              </select>
            </div>

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
          </div>
        </div>

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
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Botón de Acreditación */}
                        {!f.acreditada && f.estado === "Enviada" && (
                          <button 
                            className="btn btn-success btn-xs gap-1 text-white shadow-sm"
                            onClick={() => {
                                if(window.confirm("¿Confirmas que esta factura ha sido acreditada?")) {
                                    // Aquí llamarías a tu API: patchFactura(f.id, { acreditada: true })
                                    console.log("Factura acreditada:", f.id);
                                }
                            }}
                          >
                            <CheckCircle2 size={12} /> Acreditar
                          </button>
                        )}
                        
                        {f.acreditada && (
                          <div className="tooltip" data-tip={`Cobrado el ${f.fecha_acreditacion}`}>
                            <span className="badge badge-success text-[10px] font-black italic">PAGADA</span>
                          </div>
                        )}

                        <button className="btn btn-ghost btn-xs btn-square hover:text-primary"><Eye size={16} /></button>
                        <a href={f.pdf_path} className="btn btn-ghost btn-xs btn-square"><Download size={16} /></a>
                      </div>
                    </td>
                    <td>{renderStatusBadge(f.estado)}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        <button className="btn btn-ghost btn-xs btn-square hover:text-primary" title="Ver Detalles">
                          <Eye size={16} />
                        </button>
                        <a 
                          href={f.pdf_path} 
                          className={`btn btn-ghost btn-xs btn-square ${!f.pdf_path && 'btn-disabled opacity-20'}`}
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
    </PageLayout>
  );
};

export default Facturas;