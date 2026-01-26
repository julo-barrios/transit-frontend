import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Pasajero } from "../../types";
import PageLayout from "@/components/Layout/PageLayout";
import DynamicFieldsRenderer from "@/components/DynamicFieldsRenderer";
import { ArrowLeft, Save, User } from "lucide-react";
import { usePasajero, useUpdatePasajero } from "@/hooks/usePasajeros";
import { useObrasSociales } from "@/hooks/useObrasSociales";

export default function PasajeroEditar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Hooks
  const { data: pasajeroData, isLoading: loadingPasajero } = usePasajero(id!);
  const { data: obrasSociales = [] } = useObrasSociales(); // Uses the OS hook now too!
  const updateMutation = useUpdatePasajero();

  // Local state for form, synced with fetched data
  const [pasajero, setPasajero] = useState<Pasajero | null>(null);

  useEffect(() => {
    if (pasajeroData) {
      setPasajero(pasajeroData);
    }
  }, [pasajeroData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (pasajero) {
      setPasajero({ ...pasajero, [e.target.name]: e.target.value });
    }
  };

  const handleObraSocialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (pasajero) {
      const nuevaOS = obrasSociales.find(os => os.nombre === e.target.value);
      if (nuevaOS) {
        setPasajero({
          ...pasajero,
          obra_social: nuevaOS,
          datos_adicionales: {} // Resetear datos al cambiar
        })
      }
    }
  }

  const handleDynamicChange = (key: string, value: string | number) => {
    if (pasajero) {
      setPasajero({
        ...pasajero,
        datos_adicionales: {
          ...pasajero.datos_adicionales,
          [key]: value
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasajero || !id) return;

    updateMutation.mutate({
      id,
      data: {
        nombre: pasajero.nombre,
        apellido: pasajero.apellido,
        cuil: pasajero.cuil,
        identificador_os: pasajero.identificador_os,
        obra_social_id: pasajero.obra_social?.id,
        datos_adicionales: pasajero.datos_adicionales
      }
    }, {
      onSuccess: () => {
        navigate(`/pasajeros/${id}`);
      },
      onError: (error: any) => {
        console.error("Error updating pasajero:", error);
        const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
        alert(`Error al guardar cambios: ${errorMsg}`);
      }
    });
  };

  if (loadingPasajero) return <div className="p-8 text-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (!pasajero) return <div className="alert alert-error">Error al cargar datos del pasajero</div>;

  return (
    <PageLayout
      title="Editar Pasajero"
      breadcrumbs={[
        { label: "Inicio", path: "/" },
        { label: "Pasajeros", path: "/pasajeros" },
        { label: `${pasajero.nombre} ${pasajero.apellido}`, path: `/pasajeros/${id}` },
        { label: "Editar", path: "#" }
      ]}
      action={
        <button onClick={() => navigate(`/pasajeros/${id}`)} className="btn btn-ghost btn-sm gap-2">
          <ArrowLeft size={16} /> Cancelar
        </button>
      }
    >
      <div className="flex justify-center">
        <div className="card w-full max-w-3xl bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">

            {/* Header del Formulario */}
            <div className="flex flex-col items-center mb-8 border-b border-base-200 pb-6">
              <div className="avatar mb-4">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${pasajero.nombre}`} alt="avatar" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">{pasajero.nombre} {pasajero.apellido}</h2>
              <p className="text-base-content/60">Actualiza la información del perfil</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <User size={16} /> Nombre
                    </span>
                  </div>
                  <input
                    name="nombre"
                    type="text"
                    value={pasajero.nombre}
                    onChange={handleChange}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="Nombre"
                  />
                </label>

                {/* Apellido */}
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <User size={16} /> Apellido
                    </span>
                  </div>
                  <input
                    name="apellido"
                    type="text"
                    value={pasajero.apellido}
                    onChange={handleChange}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="Apellido"
                  />
                </label>

                {/* CUIL */}
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">CUIL / DNI</span>
                  </div>
                  <input
                    name="cuil"
                    type="text"
                    value={pasajero.cuil}
                    onChange={handleChange}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="CUIL"
                  />
                </label>

                {/* ID Obra Social */}
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">ID Obra Social</span>
                  </div>
                  <input
                    name="identificador_os"
                    type="text"
                    value={pasajero.identificador_os}
                    onChange={handleChange}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="Número de afiliado / ID"
                  />
                </label>

                {/* Obra Social */}
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">Obra Social</span>
                  </div>
                  <select
                    className="select select-bordered w-full focus:select-primary"
                    value={pasajero.obra_social?.nombre || ""}
                    onChange={handleObraSocialChange}
                  >
                    {obrasSociales.map(os => (
                      <option key={os.id} value={os.nombre}>{os.nombre}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Campos Dinámicos */}
              {pasajero.obra_social?.configuracion_pasajeros && (
                <DynamicFieldsRenderer
                  schema={pasajero.obra_social.configuracion_pasajeros}
                  values={(pasajero.datos_adicionales || {}) as unknown as Record<string, string | number>}
                  onChange={handleDynamicChange}
                />
              )}

              <div className="card-actions justify-end mt-8 pt-4 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => navigate(`/pasajeros/${id}`)}
                  className="btn btn-ghost"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary gap-2" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? <span className="loading loading-spinner"></span> : <Save size={18} />} Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
