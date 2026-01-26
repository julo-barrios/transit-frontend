import { Link } from "react-router-dom";
import PageLayout from "../../components/Layout/PageLayout";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import { useObrasSociales, useDeleteObraSocial } from "../../hooks/useObrasSociales";

const ObrasSociales = () => {
    // Hooks
    const { data: obrasSociales = [], isLoading: loading } = useObrasSociales();
    const deleteMutation = useDeleteObraSocial();

    const handleDelete = (id: number) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta obra social?")) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    // Toast or alert handled by hook or global config usually, but adding alert for consistency with old behavior if needed or just silent
                    // User asked to use service, assuming standard behavior.
                },
                onError: (error) => {
                    console.error("Error deleting:", error);
                    alert("Error al eliminar la obra social");
                }
            });
        }
    };

    return (
        <PageLayout
            title="Obras Sociales"
            breadcrumbs={[{ label: "Inicio", path: "/" }, { label: "Obras Sociales", path: "/obras-sociales" }]}
            action={
                <Link to="/obras-sociales/nueva" className="btn btn-primary btn-sm gap-2">
                    <Plus size={16} /> Nueva Obra Social
                </Link>
            }
        >
            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead className="bg-base-200/50">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th className="text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8">
                                            <span className="loading loading-spinner loading-md text-primary"></span>
                                        </td>
                                    </tr>
                                ) : obrasSociales.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8 text-base-content/50">
                                            No hay obras sociales registradas.
                                        </td>
                                    </tr>
                                ) : (
                                    obrasSociales.map((os) => (
                                        <tr key={os.id} className="hover:bg-base-200/30 transition-colors">
                                            <td className="font-mono text-xs opacity-50">#{os.id}</td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-neutral-focus text-neutral-content rounded-full w-8 h-8 flex items-center justify-center bg-primary/10 text-primary">
                                                            <Building2 size={16} />
                                                        </div>
                                                    </div>
                                                    <span className="font-bold">{os.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        to={`/obras-sociales/${os.id}/editar`}
                                                        className="btn btn-square btn-ghost btn-xs text-info"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(os.id)}
                                                        className="btn btn-square btn-ghost btn-xs text-error"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default ObrasSociales;
