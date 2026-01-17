import { useEffect, useState } from "react";
import { MOCK_PASAJEROS_DETALLADO } from "../../mocks/Data";
import type { PasajeroListItem } from "../../types";
import PageLayout from "../../components/PageLayout";
import { Link } from "react-router-dom";

const PasajerosTable = () => {
  const [pasajeros, setPasajeros] = useState<PasajeroListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga
    const timer = setTimeout(() => {
      setPasajeros(MOCK_PASAJEROS_DETALLADO as unknown as PasajeroListItem[]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="text-center">Cargando pasajeros...</div>;


  return (
    <PageLayout title="Listado de pasajeros" breadcrumbs={["Home", "Pasajeros"]}>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th><input type="checkbox" className="checkbox" /></th>
              <th>Nombre</th>
              <th>Obra Social</th>
              <th>Último Periodo</th>
              <th>Fecha de creacion</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pasajeros.map((p) => (
              <tr key={p.id}>
                <td><input type="checkbox" className="checkbox" /></td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${p.nombre}`} alt="avatar" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{p.nombre} {p.apellido}</div>
                      <div className="text-sm opacity-50">{p.cuil}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-primary badge-sm">{(p as any).obra_social?.nombre || "N/A"}</span>
                </td>
                <td>{p.ultimo_periodo || "-"}</td>
                <td>{new Date(p.created_at.Time).toLocaleDateString()}</td>
                <th>
                  <Link to={`/pasajeros/${p.cuil}`} className="btn btn-ghost btn-xs">
                    detalles
                  </Link>

                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}


export default PasajerosTable;