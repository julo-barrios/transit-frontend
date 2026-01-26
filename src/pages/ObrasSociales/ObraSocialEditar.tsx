import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../components/Layout/PageLayout";
import { ArrowLeft, Save, Building2 } from "lucide-react";
import type { ObraSocial } from "@/types";
import SchemaBuilder from "@/components/SchemaBuilder";
import { useObraSocial, useUpdateObraSocial } from "../../hooks/useObrasSociales";

const ObraSocialEditar = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // React Query Hooks
    const { data: obraSocialData, isLoading: isLoadingData } = useObraSocial(id!);
    const updateMutation = useUpdateObraSocial();

    // Local state for form handling
    const [obraSocial, setObraSocial] = useState<ObraSocial | null>(null);

    // Sync data to local state when fetched
    useEffect(() => {
        if (obraSocialData) {
            setObraSocial(obraSocialData);
        }
    }, [obraSocialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!obraSocial || !id) return;

        updateMutation.mutate({
            id,
            data: {
                nombre: obraSocial.nombre,
                configuracion_pasajeros: obraSocial.configuracion_pasajeros
            }
        }, {
            onSuccess: () => {
                alert("Obra social actualizada con éxito");
                navigate("/obras-sociales");
            },
            onError: (error) => {
                console.error("Error al actualizar:", error);
                alert("Error al actualizar la obra social");
            }
        });
    };

    if (isLoadingData) return <div className="p-8 text-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (!obraSocial) return <div className="p-8 text-center">No encontrada</div>;

    return (
        <PageLayout
            title="Editar Obra Social"
            breadcrumbs={[
                { label: "Inicio", path: "/" },
                { label: "Obras Sociales", path: "/obras-sociales" },
                { label: obraSocial.nombre, path: "#" },
                { label: "Editar", path: "#" }
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
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? <span className="loading loading-spinner"></span> : <Save size={18} />}
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
