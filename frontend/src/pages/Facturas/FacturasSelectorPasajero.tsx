import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "../../components/Layout/PageLayout";
import { getObrasSociales } from "../../services/pasajeros";
//import type { ObraSocial, PasajeroListItem } from "../../types";
import { Building2, User, ArrowRight, Search } from "lucide-react";
import { MOCK_OBRAS_SOCIALES, MOCK_PASAJEROS } from "../../mocks/Data";
// ... en el componente:

export default function FacturaSelectorPasajero() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  //   const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([]);
  //   const [pasajeros, setPasajeros] = useState<PasajeroListItem[]>([]);
  const [obrasSociales] = useState(MOCK_OBRAS_SOCIALES);
  const [pasajeros] = useState(MOCK_PASAJEROS);

  // Initialize from URL or default to empty
  const [selectedOS, setSelectedOS] = useState<string>(searchParams.get("obraSocial") || "");

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [osData, pasData] = await Promise.all([
          getObrasSociales(),
          fetch('/api/v1/pasajeros').then(res => res.json())
        ]);
        //setObrasSociales(osData);
        //setPasajeros(pasData);
      } catch (err) {
        console.error("Error cargando selectores:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtrado lógico
  const pasajerosFiltrados = pasajeros.filter(p => {
    const matchesOS = selectedOS === "" || p.obra_social?.nombre === selectedOS;
    const matchesSearch = (p.nombre + " " + p.apellido).toLowerCase().includes(searchTerm.toLowerCase()) || p.cuil.includes(searchTerm);
    return matchesOS && matchesSearch;
  });

  return (
    <PageLayout title="Nueva Factura: Seleccionar Pasajero" breadcrumbs={["Inicio", "Facturas", "Selección"]}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-200/50 p-6 rounded-2xl border border-base-300">
          <div className="form-control">
            <label className="label font-bold text-xs uppercase opacity-60">1. Filtrar por Obra Social</label>
            <div className="join w-full">
              <div className="join-item btn btn-disabled bg-base-100 border-base-300"><Building2 size={18} /></div>
              <select
                className="select select-bordered join-item w-full"
                value={selectedOS}
                onChange={(e) => setSelectedOS(e.target.value)}
              >
                <option value="">Todas las Obras Sociales</option>
                {obrasSociales.map(os => (
                  <option key={os.id} value={os.nombre}>{os.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label font-bold text-xs uppercase opacity-60">2. Buscar Pasajero</label>
            <div className="join w-full">
              <div className="join-item btn btn-disabled bg-base-100 border-base-300"><Search size={18} /></div>
              <input
                type="text"
                placeholder="Nombre o CUIL..."
                className="input input-bordered join-item w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Lista de Resultados */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm opacity-50 px-2 uppercase tracking-widest">Pasajeros Disponibles ({pasajerosFiltrados.length})</h3>
          {loading ? (
            <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {pasajerosFiltrados.map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/pasajeros/${p.id}/facturas/nueva`)}
                  className="group flex items-center justify-between p-4 bg-base-100 border border-base-200 rounded-xl hover:border-primary hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full bg-base-200 p-1">
                        <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${p.nombre}`} alt="avatar" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{p.nombre} {p.apellido}</p>
                      <div className="flex gap-2 items-center">
                        <span className="badge badge-sm badge-outline opacity-70">{p.cuil}</span>
                        <span className="badge badge-primary badge-sm font-bold uppercase">{p.obra_social?.nombre || "Sin OS"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="btn btn-ghost btn-circle group-hover:bg-primary group-hover:text-primary-content transition-colors">
                    <ArrowRight size={20} />
                  </div>
                </div>
              ))}
              {pasajerosFiltrados.length === 0 && (
                <div className="alert alert-info border-dashed bg-transparent">
                  <span>No se encontraron pasajeros con esos criterios.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}