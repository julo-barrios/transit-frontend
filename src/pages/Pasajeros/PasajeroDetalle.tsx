import { useParams, useNavigate, Link } from "react-router-dom";
import PageLayout from "../../components/Layout/PageLayout";
import { type PasajeroDetail } from "../../types";
import FacturasTable from "./PasajeroFacturasTable";
import { User, CreditCard, ArrowLeft, Pencil, Plus } from "lucide-react";
import { usePasajero } from "../../hooks/usePasajeros";

const PasajeroDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: pasajerosData, isLoading, isError, error } = usePasajero(id!);
  const pasajero = pasajerosData as PasajeroDetail | undefined;

  if (isLoading) return <div className="p-8 text-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (isError) return <div className="alert alert-error">Error al cargar pasajero: {(error as Error).message}</div>;
  if (!pasajero) return <div className="alert alert-warning">No se encontró el pasajero</div>;

  return (
    <PageLayout
      title="Detalle del Pasajero"
      breadcrumbs={[
        { label: "Inicio", path: "/" },
        { label: "Pasajeros", path: "/pasajeros" },
        { label: `${pasajero.nombre} ${pasajero.apellido} `, path: ` / pasajeros / ${pasajero.id} ` }
      ]}
      action={
        <button onClick={() => navigate("/pasajeros")} className="btn btn-ghost btn-sm gap-2">
          <ArrowLeft size={16} /> Volver
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* COLUMNA IZQUIERDA: Perfil */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body items-center text-center">
              <div className="avatar mb-4">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${pasajero.nombre}`} alt="avatar" />
                </div >
              </div >
              <h2 className="card-title text-2xl">{pasajero.nombre} {pasajero.apellido}</h2>
              <p className="text-base-content/70 text-sm">CUIL: {pasajero.cuil}</p>
              <div className="card-actions mt-6 w-full">
                <Link to={`/pasajeros/${pasajero.id}/editar`} className="btn btn-primary btn-outline btn-sm w-full gap-2">
                  <Pencil size={14} /> Editar Perfil
                </Link>
              </div>
            </div >
          </div >

          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <User size={18} /> Datos Personales
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-base-200 pb-2">
                  <span className="text-sm text-base-content/70">Fecha Nacimiento</span>
                  <span className="font-medium">{pasajero.fecha_nacimiento}</span>
                </div>
                <div className="flex justify-between border-b border-base-200 pb-2">
                  <span className="text-sm text-base-content/70">ID Obra Social</span>
                  <span className="font-medium">{pasajero.identificador_os}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-sm text-base-content/70">Obra Social</span>
                  <span className="badge badge-neutral">{pasajero.obra_social?.nombre || "N/A"}</span>
                </div>

                {/* Campos Dinámicos de Obra Social */}
                {pasajero.obra_social?.configuracion_pasajeros?.map((campo) => {
                  const valor = pasajero.datos_adicionales?.[campo.key];
                  return (
                    <div key={campo.key} className="flex justify-between border-t border-base-200 pt-2 pb-2">
                      <span className="text-sm text-base-content/70">{campo.label}</span>
                      <span className="font-medium text-right">{valor ? String(valor) : "-"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div >

        {/* COLUMNA DERECHA: Facturación */}
        < div className="lg:col-span-2" >
          <div className="card bg-base-100 shadow-sm border border-base-200 h-full">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <CreditCard size={18} /> Historial de Facturas
                </h3>
                <Link
                  to={`/pasajeros/${pasajero.id}/facturas/nueva`}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <Plus size={16} /> Nueva Factura
                </Link>
              </div>

              {/* Tabla de Facturas */}
              <FacturasTable facturas={pasajero.facturas} />
            </div>
          </div>
        </div >

      </div >
    </PageLayout >
  );
};

export default PasajeroDetalle;
