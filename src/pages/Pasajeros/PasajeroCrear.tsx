import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pasajerosService } from "../../services/pasajeros";
import { obrasSocialesService } from "../../services/obrasSociales";
import PageLayout from "@/components/Layout/PageLayout";
import DynamicFieldsRenderer from "@/components/DynamicFieldsRenderer";
import { ArrowLeft, Save, User } from "lucide-react";
import type { ObraSocial } from "@/types";

export default function PasajeroCrear() {
  const navigate = useNavigate();
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([]);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cuil: "",
    obra_social: null as ObraSocial | null,
    datos_adicionales: {} as Record<string, unknown>
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    obrasSocialesService.getAll().then((data) => setObrasSociales(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleObraSocialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaOS = obrasSociales.find(os => os.nombre === e.target.value) || null;
    setFormData({
      ...formData,
      obra_social: nuevaOS,
      datos_adicionales: {} // Reset dynamic fields when OS changes
    });
  };

  const handleDynamicChange = (key: string, value: string | number) => {
    setFormData({
      ...formData,
      datos_adicionales: {
        ...formData.datos_adicionales,
        [key]: value
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.obra_social) return; // Validation: needs OS

    setLoading(true);
    await pasajerosService.create({
      nombre: formData.nombre,
      apellido: formData.apellido,
      cuil: formData.cuil, // Added CUIL support
      obra_social_id: formData.obra_social.id,
      datos_adicionales: formData.datos_adicionales
    });
    setLoading(false);
    navigate("/pasajeros");
  };

  return (
    <PageLayout
      title="Nuevo Pasajero"
      breadcrumbs={["Inicio", "Pasajeros", "Crear"]}
      action={
        <button onClick={() => navigate("/pasajeros")} className="btn btn-ghost btn-sm gap-2">
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
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-base-200 flex items-center justify-center">
                  {formData.nombre ? (
                    <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${formData.nombre}`} alt="avatar" />
                  ) : (
                    <User size={48} className="opacity-20" />
                  )}
                </div>
              </div>
              <h2 className="text-2xl font-bold">{formData.nombre || "Nuevo"} {formData.apellido || "Pasajero"}</h2>
              <p className="text-base-content/60">Ingrese la información del nuevo perfil</p>
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
                    value={formData.nombre}
                    onChange={handleChange}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="Nombre"
                    required
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
                    value={formData.apellido}
                    onChange={handleChange}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="Apellido"
                    required
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
                    value={formData.cuil}
                    onChange={handleChange}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="CUIL"
                    required
                  />
                </label>

                {/* Obra Social */}
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">Obra Social</span>
                  </div>
                  <select
                    className="select select-bordered w-full focus:select-primary"
                    value={formData.obra_social?.nombre || ""}
                    onChange={handleObraSocialChange}
                    required
                  >
                    <option value="" disabled>Seleccioná una obra social</option>
                    {obrasSociales.map(os => (
                      <option key={os.id} value={os.nombre}>{os.nombre}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Campos Dinámicos */}
              {formData.obra_social?.configuracion_pasajeros && (
                <DynamicFieldsRenderer
                  schema={formData.obra_social.configuracion_pasajeros}
                  values={formData.datos_adicionales as unknown as Record<string, string | number>}
                  onChange={handleDynamicChange}
                />
              )}

              <div className="card-actions justify-end mt-8 pt-4 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => navigate("/pasajeros")}
                  className="btn btn-ghost"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary gap-2" disabled={loading}>
                  {loading ? <span className="loading loading-spinner loading-sm"></span> : <Save size={18} />}
                  Crear Pasajero
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
