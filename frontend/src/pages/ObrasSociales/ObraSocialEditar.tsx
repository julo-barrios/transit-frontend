import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { MOCK_OBRAS_SOCIALES } from "../../mocks/Data";
import { ArrowLeft, Save, Building2 } from "lucide-react";
import type { ObraSocial, CampoConfiguracion } from "@/types";
import SchemaBuilder from "@/components/SchemaBuilder";

const ObraSocialEditar = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [obraSocial, setObraSocial] = useState<ObraSocial | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Simular fetch
        const found = MOCK_OBRAS_SOCIALES.find(os => os.id === Number(id));
        if (found) {
            setObraSocial(found);
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!obraSocial) return;

        setLoading(true);

        // Simular PUT a API
        console.log("Actualizando obra social:", obraSocial);
        await new Promise(resolve => setTimeout(resolve, 800));

        // alert("Obra social actualizada (simulación)");
        setLoading(false);
        navigate("/obras-sociales");
    };

    if (!obraSocial && id) return <div className="p-8 text-center">Cargando...</div>;
    if (!obraSocial) return <div className="p-8 text-center">No encontrada</div>;

    return (
        <PageLayout
            title="Editar Obra Social"
            breadcrumbs={["Inicio", "Obras Sociales", obraSocial.nombre, "Editar"]}
            action={
                <button onClick={() => navigate("/obras-sociales")} className="btn btn-ghost btn-sm gap-2">
                    <ArrowLeft size={16} /> Cancelar
                </button>
            }
        >
            <div className="flex justify-center">
                <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                        <h2 className="card-title mb-4 flex gap-2">
                            <Building2 className="text-primary" /> Editar Datos
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-bold">Nombre</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full focus:input-primary"
                                    value={obraSocial.nombre}
                                    onChange={(e) => setObraSocial({ ...obraSocial, nombre: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Constructor de Esquema */}
                            <div className="divider"></div>
                            <SchemaBuilder
                                fields={obraSocial.configuracion_pasajeros || []}
                                onChange={(newFields) => setObraSocial({ ...obraSocial, configuracion_pasajeros: newFields })}
                            />

                            <div className="card-actions justify-end pt-4">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => navigate("/obras-sociales")}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary gap-2"
                                    disabled={loading}
                                >
                                    {loading ? <span className="loading loading-spinner"></span> : <Save size={18} />}
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default ObraSocialEditar;
