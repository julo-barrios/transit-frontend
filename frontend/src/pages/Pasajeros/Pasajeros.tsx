import { useEffect, useState } from "react";
import { MOCK_PASAJEROS_DETALLADO } from "@/mocks/Data";
import type { PasajeroListItem } from "@/types";
import PageLayout from "@/components/Layout/PageLayout";
import TableToolbar from "@/components/TableToolbar";
import ObraSocialFilter from "@/components/ObraSocialFilter";
import { Link } from "react-router-dom";
import {
  Building2,
  UserPlus,
  Eye,
  Pencil,
  Trash2
} from "lucide-react";

const PasajerosTable = () => {
  const [pasajeros, setPasajeros] = useState<PasajeroListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [osFilter, setOsFilter] = useState("Todas");

  useEffect(() => {
    // Simular carga
    const timer = setTimeout(() => {
      setPasajeros(MOCK_PASAJEROS_DETALLADO as unknown as PasajeroListItem[]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Lógica de filtrado avanzada
  // Lógica de filtrado avanzada
  const pasajerosFiltrados = pasajeros.filter(p => {
    // Obra social puede ser un objeto o string (según backend/mock)
    const nombreOS = typeof p.obra_social === 'string'
      ? p.obra_social
      : p.obra_social?.nombre || "Sin OS";

    const nombreCompleto = `${p.nombre} ${p.apellido}`.toLowerCase();

    // Búsqueda robusta
    const matchesSearch = nombreCompleto.includes(searchTerm.toLowerCase()) ||
      p.cuil.toString().includes(searchTerm);

    const matchesOS = osFilter === "Todas" || nombreOS === osFilter;

    return matchesSearch && matchesOS;
  });

  if (loading) return <div className="text-center p-10"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <PageLayout
      title="Gestión de Pasajeros"
      breadcrumbs={["Inicio", "Pasajeros"]}
      action={
        <Link to="/pasajeros/crear" className="btn btn-primary btn-sm gap-2 shadow-lg shadow-primary/20">
          <UserPlus size={16} /> Nuevo Pasajero
        </Link>
      }
    >
      <div className="space-y-6">

        {/* Barra de Herramientas (Similar a Facturas) */}
        {/* Barra de Herramientas (Similar a Facturas) */}
        <TableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Buscar por nombre o CUIL..."
        >
          {/* Filtro Obra Social */}
          <ObraSocialFilter value={osFilter} onChange={setOsFilter} />
        </TableToolbar>

        {/* Tabla de Pasajeros */}
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200/50">
              <tr className="text-xs uppercase opacity-60">
                <th>Pasajero</th>
                <th>Obra Social</th>
                <th>Datos Adicionales</th>
                <th>Ult. Periodo</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pasajerosFiltrados.map((p) => {
                return (
                  <tr key={p.id} className="hover:bg-base-200/40 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                            <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${p.nombre}`} alt="avatar" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{p.nombre} {p.apellido}</div>
                          <div className="text-[10px] opacity-50 font-mono">CUIL: {p.cuil}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="badge badge-outline gap-2 font-bold text-xs">
                        <Building2 size={10} />
                        {typeof p.obra_social === 'string' ? p.obra_social : p.obra_social?.nombre || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="text-xs">
                        <span className="opacity-50">N° AD:</span> <span className="font-mono font-bold">{p.numero_ad}</span>
                      </div>
                      <div className="text-[10px] opacity-40">
                        Alta: {new Date(p.created_at.Time).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      {p.ultimo_periodo ? (
                        <span className="badge badge-ghost badge-sm font-mono">{p.ultimo_periodo}</span>
                      ) : (
                        <span className="text-xs opacity-30 italic">Sin datos</span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link to={`/pasajeros/${p.cuil}`} className="btn btn-ghost btn-xs btn-square hover:text-primary" title="Ver Detalles">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/pasajeros/${p.cuil}/editar`} className="btn btn-ghost btn-xs btn-square hover:text-warning" title="Editar">
                          <Pencil size={16} />
                        </Link>
                        <button className="btn btn-ghost btn-xs btn-square hover:text-error" title="Eliminar (Simulado)">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {pasajerosFiltrados.length === 0 && (
            <div className="py-20 text-center opacity-30">
              <UserPlus size={48} className="mx-auto mb-2" />
              <p className="font-medium">No se encontraron pasajeros.</p>
            </div>
          )}

        </div>
      </div>
    </PageLayout>
  );
}

export default PasajerosTable;