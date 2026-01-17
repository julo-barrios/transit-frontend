import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PageLayout from "../../components/PageLayout";
import { MOCK_PASAJEROS_DETALLADO } from "../../mocks/Data";
import { type PasajeroDetail } from "../../types";
import FacturasTable from "./PasajeroFacturasTable";

const PasajeroDetalle = () => {
  const { cuil } = useParams<{ cuil: string }>();
  // Inicializamos a null pero tipamos como PasajeroDetail
  const [pasajero, setPasajero] = useState<PasajeroDetail | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simular fetch encontrando por CUIL en el mock
    const found = MOCK_PASAJEROS_DETALLADO.find(p => p.cuil === cuil);
    if (found) {
      setPasajero(found);
    }
  }, [cuil]);

  if (!pasajero) return <div className="p-4">Cargando pasajero... (o no encontrado)</div>;

  return (
    <PageLayout
      title={`${pasajero.nombre} ${pasajero.apellido}`}
      breadcrumbs={["Home", "Pasajeros", pasajero.nombre]}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div><span className="font-bold">Nombre:</span> {pasajero.nombre}</div>
            <div><span className="font-bold">Apellido:</span> {pasajero.apellido}</div>
            <div><span className="font-bold">CUIL:</span> {pasajero.cuil}</div>
            <div><span className="font-bold">Obra social:</span> {pasajero.obra_social?.nombre || "N/A"}</div>

          </div>
          <div className="flex justify-end gap-1">
            <button
              className="btn btn-outline"
              onClick={() => navigate("/pasajeros")}
            >
              Volver al listado
            </button>

            <Link to={`/pasajeros/${pasajero.cuil}/editar`} className="btn btn-primary">
              Editar pasajero
            </Link>
          </div>
        </div>

        <div className="divider" />
        <div className="grid grid-cols-2 gap-4">
          <div><span className="font-bold">Numero AD:</span> {pasajero.numero_ad}</div>
        </div>
        <div className="divider" />
        <div className="flex justify-end mb-2">
          <Link
            to={`/pasajeros/${pasajero.id}/facturas/nueva`}
            className="btn btn-primary btn-sm"
          >
            + Cargar factura
          </Link>
        </div>

        {/* Pasamos las facturas del mock */}
        <FacturasTable facturas={pasajero.facturas} />
      </div>
    </PageLayout>
  );
};

export default PasajeroDetalle;
