import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "../../components/Layout/PageLayout";
import { obrasSocialesService } from "../../services/obrasSociales";
import { pasajerosService } from "../../services/pasajeros";
import type { ObraSocial, PasajeroListItem } from "../../types";
import { Building2, ArrowRight, Search } from "lucide-react";
// ... en el componente:

export default function FacturaSelectorPasajero() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([]);
  const [pasajeros, setPasajeros] = useState<PasajeroListItem[]>([]);

  // Initialize from URL or default to empty
  const [selectedOS, setSelectedOS] = useState<string>(searchParams.get("obraSocial") || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [osData, pasData] = await Promise.all([
          obrasSocialesService.getAll(),
          pasajerosService.getAll()
        ]);
        setObrasSociales(osData); // Now using the service data
        setPasajeros(pasData);
      } catch (err) {
        console.error("Error cargando selectores:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Sync URL with State
  useEffect(() => {
    const osFromUrl = searchParams.get("obraSocial");
    if (osFromUrl) {
      setSelectedOS(osFromUrl);
    }
  }, [searchParams]);

  const pasajerosFiltrados = pasajeros.filter(p => {
    // Handle both object and string (legacy/mock) types safely
    const osName = typeof p.obra_social === 'string' ? p.obra_social : p.obra_social?.nombre;

    const matchesOS = selectedOS === "" || osName === selectedOS;
    const matchesSearch = (p.nombre + " " + p.apellido).toLowerCase().includes(searchTerm.toLowerCase()) || p.cuil.includes(searchTerm);
    return matchesOS && matchesSearch;
  });

  return (
    <PageLayout title="Nueva Factura: Seleccionar Pasajero" breadcrumbs={[
      { label: "Inicio", path: "/" },
      { label: "Facturas", path: "/facturas" },
      { label: "Selección", path: "/facturas/nueva" }
    ]}>
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
                        <span className="badge badge-primary badge-sm font-bold uppercase">{typeof p.obra_social === 'string' ? p.obra_social : p.obra_social?.nombre || "Sin OS"}</span>
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