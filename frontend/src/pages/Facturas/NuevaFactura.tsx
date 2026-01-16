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

// Esto idealmente vendría de una configuración en la DB
const PRECIO_KM_DEFAULT = 450; 

const NuevaFactura = () => {
  const { pasajeroId } = useParams<{ pasajeroId: string }>();
  const navigate = useNavigate();
  const [pasajero, setPasajero] = useState<Pasajero | null>(null);
  
  const [form, setForm] = useState({
    kilometros: "",
    periodo: "",
    archivo: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  // Cargamos datos del pasajero para mostrar contexto (nombre, obra social)
  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/pasajeros/${pasajeroId}`)
      .then((res) => res.json())
      .then((data) => setPasajero(data))
      .catch(err => console.error("Error cargando pasajero:", err));
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

    const formData = new FormData();
    formData.append("pasajero_id", pasajeroId!);
    formData.append("kilometros", form.kilometros);
    formData.append("periodo", form.periodo);
    if (form.archivo) formData.append("archivo", form.archivo);
    
    // El backend recibirá esto e iniciará el proceso con ARCA
    try {
      const res = await fetch("http://localhost:8080/api/v1/facturas/generate", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        // Redirigimos al detalle para ver el estado "Procesando"
        navigate(`/pasajeros/${pasajero?.cuil}`);
      } else {
        alert("Error al iniciar la generación de factura");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${pasajero?.nombre}`} alt="avatar" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-primary uppercase">{pasajero?.nombre} {pasajero?.apellido}</h2>
              <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Obra Social: {pasajero?.obra_social?.nombre || "OSECAC"}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="badge badge-primary font-bold">ESTRATEGIA: PORTAL WEB</span>
          </div>
        </div>

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