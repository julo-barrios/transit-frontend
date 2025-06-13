import { useEffect, useState } from "react";
import type  { PasajeroListItem } from "../../types";
import PageLayout from "../../components/PageLayout";
import { Link } from "react-router-dom";

const PasajerosTable = () => {
  const [pasajeros, setPasajeros] = useState<PasajeroListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPasajeros = async () => {
      try {
        const response = await fetch('/api/v1/pasajeros');
        if (!response.ok) throw new Error("Error al cargar pasajeros");
        const data = await response.json();
        setPasajeros(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPasajeros();
  }, []);

  if (loading) return <div className="text-center">Cargando pasajeros...</div>;


  return (
    <PageLayout title = "Listado de pasajeros" breadcrumbs={["Home", "Pasajeros"]}>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th><input type="checkbox" className="checkbox" /></th>
              <th>Nombre</th>
              <th>Obra Social</th>
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
                  <span className="badge badge-primary badge-sm">{p.obra_social}OSECAC</span>
                </td>
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