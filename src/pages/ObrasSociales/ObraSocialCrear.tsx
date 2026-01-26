import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/Layout/PageLayout";
import { ArrowLeft, Save, Building2 } from "lucide-react";
import { useCreateObraSocial } from "../../hooks/useObrasSociales";

const ObraSocialCrear = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");

    // React Query Mutation
    const createMutation = useCreateObraSocial();
    const loading = createMutation.isPending;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        createMutation.mutate({
            nombre,
            configuracion_pasajeros: [] // Inicialmente vacío o agregar lógica de campos dinámicos
        }, {
            onSuccess: () => {
                alert("Obra social creada con éxito");
                navigate("/obras-sociales");
            },
            onError: (error) => {
                console.error("Error al crear:", error);
                alert("Hubo un error al crear la obra social");
            }
        });
    };

    return (
        <PageLayout
            title="Nueva Obra Social"
            breadcrumbs={[
                { label: "Inicio", path: "/" },
                { label: "Obras Sociales", path: "/obras-sociales" },
                { label: "Crear", path: "/obras-sociales/nueva" }
            ]}
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
