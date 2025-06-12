import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import type { Pasajero } from "../types";

const PasajeroDetalle = () => {
  const { cuil } = useParams<{ cuil: string }>();
  const [pasajero, setPasajero] = useState<Pasajero | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/v1/pasajeros/${cuil}`)
      .then((res) => res.json())
      .then((data) => setPasajero(data));
  }, [cuil]);

  if (!pasajero) return <div className="p-4">Cargando pasajero...</div>;

  return (
    <PageLayout
      title={`${pasajero.nombre} ${pasajero.apellido}`}
      breadcrumbs={["Home", "Pasajeros", pasajero.nombre]}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><span className="font-bold">Nombre:</span> {pasajero.nombre}</div>
          <div><span className="font-bold">Apellido:</span> {pasajero.apellido}</div>
          <div><span className="font-bold">CUIL:</span> {pasajero.cuil}</div>
          <div><span className="font-bold">Obra social:</span> {pasajero.obra_social?.nombre || "N/A"}</div>
        </div>

        <div className="divider" />

        <div className="flex justify-end gap-2">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/pasajeros")}
          >
            Volver al listado
          </button>

          <Link to={`/pasajeros/${pasajero.id}/editar`} className="btn btn-primary">
            Editar pasajero
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default PasajeroDetalle;
