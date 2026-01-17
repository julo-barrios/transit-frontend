import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/Layout/PageLayout";
import { ArrowLeft, Save, Building2 } from "lucide-react";

const ObraSocialCrear = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simular POST a API
        console.log("Creando obra social:", { nombre });
        await new Promise(resolve => setTimeout(resolve, 800));

        alert("Obra social creada con éxito (simulación)");
        setLoading(false);
        navigate("/obras-sociales");
    };

    return (
        <PageLayout
            title="Nueva Obra Social"
            breadcrumbs={["Inicio", "Obras Sociales", "Crear"]}
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
                            <Building2 className="text-primary" /> Datos de la Obra Social
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-bold">Nombre</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: OSECAC"
                                    className="input input-bordered w-full focus:input-primary"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>

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
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default ObraSocialCrear;
