import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import {
  Calculator,
  UploadCloud,
  FileCheck,
  Calendar,
  Zap,
  ArrowLeft,
  Info
} from "lucide-react";
import type { Pasajero } from "../../types";
import { MOCK_PASAJEROS } from "../../mocks/Data";

// Esto idealmente vendría de una configuración en la DB
const PRECIO_KM_DEFAULT = 450;

const NuevaFactura = () => {
  const { pasajeroId } = useParams<{ pasajeroId: string }>();
  // En MOCK_PASAJEROS el id es number, pero useParams trae string. 
  // Sin embargo, en el router usamos :pasajeroId, pero en Pasajeros.tsx usamos :cuil para navegar.
  // Revisemos el componente anterior. PasajeroDetalle usa :id para el link: `/pasajeros/${pasajero.id}/facturas/nueva`

  const navigate = useNavigate();
  const [pasajero, setPasajero] = useState<Pasajero | null>(null);

  const [form, setForm] = useState({
    kilometros: "",
    periodo: "",
    archivo: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  // Cargamos datos del pasajero desde el mock
  useEffect(() => {
    if (pasajeroId) {
      const found = MOCK_PASAJEROS.find(p => p.id === Number(pasajeroId));
      if (found) {
        setPasajero(found);
      }
    }
  }, [pasajeroId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const totalCalculado = Number(form.kilometros) * PRECIO_KM_DEFAULT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular proceso
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Redirigimos al detalle para ver el estado "Procesando"
    // Usamos el CUIL para navegar porque es la ruta del detalle
    if (pasajero) {
      navigate(`/pasajeros/${pasajero.cuil}`);
    }
    setLoading(false);
  };

  return (
    <PageLayout
      title="Generar Factura"
      breadcrumbs={["Inicio", "Pasajeros", pasajero?.nombre || "Cargando...", "Nueva Factura"]}
      action={
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm gap-2">
          <ArrowLeft size={16} /> Volver
        </button>
      }
    >
      <div className="max-w-3xl mx-auto">
        {/* Banner de Información del Pasajero */}
        {pasajero && (
          <div className="bg-base-100 shadow-lg border border-base-200 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${pasajero.nombre}`} alt="avatar" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-base-content">{pasajero.nombre} {pasajero.apellido}</h2>
                <div className="flex flex-col text-sm opacity-70">
                  <span className="font-mono">CUIL: {pasajero.cuil}</span>
                  <span className="font-bold uppercase text-primary">Obra Social: {pasajero.obra_social?.nombre || "NO ASIGNADA"}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="badge badge-primary p-3 font-bold">ESTRATEGIA: PORTAL WEB</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Campo Kilómetros */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase flex items-center gap-2">
                  <Calculator size={14} className="text-primary" /> Kilómetros Recorridos
                </span>
              </label>
              <input
                type="number"
                name="kilometros"
                placeholder="0.00"
                className="input input-bordered input-lg w-full focus:border-primary font-mono text-2xl"
                onChange={handleChange}
                required
              />
              <label className="label">
                <span className="label-text-alt text-primary font-bold">
                  Total Estimado: ${totalCalculado.toLocaleString('es-AR')}
                </span>
              </label>
            </div>

            {/* Campo Periodo */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase flex items-center gap-2">
                  <Calendar size={14} className="text-primary" /> Periodo Correspondiente
                </span>
              </label>
              <select
                name="periodo"
                className="select select-bordered select-lg w-full"
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Mes...</option>
                <option value="2023-10">Octubre 2023</option>
                <option value="2023-11">Noviembre 2023</option>
                <option value="2023-12">Diciembre 2023</option>
              </select>
            </div>
          </div>

          {/* Subida de Archivo */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-bold text-xs uppercase flex items-center gap-2">
                <FileCheck size={14} className="text-primary" /> Planilla Firmada (Escaneo/Foto)
              </span>
            </label>
            <div className="flex items-center justify-center w-full">
              <label className={`
                flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                ${form.archivo ? "border-success bg-success/5" : "border-base-300 hover:bg-base-200"}
              `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  {form.archivo ? (
                    <>
                      <FileCheck className="w-12 h-12 mb-3 text-success" />
                      <p className="text-sm font-bold text-success">{form.archivo.name}</p>
                      <p className="text-xs opacity-60">¡Archivo listo para subir!</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-sm font-bold opacity-60 uppercase">Click para subir o arrastrar archivo</p>
                      <p className="text-xs opacity-40">Formatos permitidos: PDF, JPG, PNG (Max. 5MB)</p>
                    </>
                  )}
                </div>
                <input type="file" name="archivo" className="hidden" onChange={handleChange} accept="image/*,application/pdf" required />
              </label>
            </div>
          </div>

          {/* Alerta de Proceso */}
          <div className="alert bg-base-200 border-none rounded-xl text-xs flex items-start gap-4">
            <Info size={24} className="text-primary" />
            <div>
              <p className="font-bold uppercase tracking-wider mb-1">Información del proceso</p>
              <p className="opacity-70 leading-relaxed">
                Al guardar, se enviará una solicitud de generación a <strong>ARCA</strong>.
                Una vez autorizada, el sistema enviará automáticamente el correo a la <strong>Obra Social</strong> correspondiente y te notificará por el panel.
              </p>
            </div>
          </div>

          {/* Botón de Acción */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg shadow-xl shadow-primary/20 gap-3"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Zap size={20} fill="currentColor" />
            )}
            GENERAR Y NOTIFICAR
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default NuevaFactura;