import { useState, useEffect } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import { Save, Building2, Receipt, Palette, Monitor, Moon, Sun } from "lucide-react";

// Tipos para la configuración
interface ConfigEmpresa {
    nombre: string;
    razonSocial: string;
    cuit: string;
    direccion: string;
    email: string;
    logoUrl: string;
}

interface ConfigSistema {
    valorKmDefault: number;
}

const Configuracion = () => {
    const [activeTab, setActiveTab] = useState<"empresa" | "sistema" | "apariencia">("empresa");
    const [loading, setLoading] = useState(false);

    // Mock de datos iniciales (idealmente vendrían de localStorage o API)
    const [empresa, setEmpresa] = useState<ConfigEmpresa>({
        nombre: "Transportes Julo",
        razonSocial: "Transportes Julo S.A.",
        cuit: "30-12345678-9",
        direccion: "Av. Siempre Viva 123, CABA",
        email: "administracion@transportesjulo.com",
        logoUrl: "https://via.placeholder.com/150",
    });

    const [sistema, setSistema] = useState<ConfigSistema>({
        valorKmDefault: 850,
    });

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simular guardado
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoading(false);
        // Aquí se guardaría en localStorage o API
        console.log("Configuración guardada:", { empresa, sistema });
        // alert("Configuración guardada correctamente");
    };

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);


    return (
        <PageLayout
            title="Configuración"
            breadcrumbs={["Inicio", "Configuración"]}
        >
            <div className="flex flex-col md:flex-row gap-6">

                {/* Sidebar de Tabs */}
                <div className="w-full md:w-64 shrink-0">
                    <ul className="menu bg-base-100 border border-base-200 rounded-xl p-2 gap-1">
                        <li>
                            <button
                                className={activeTab === "empresa" ? "active font-bold" : ""}
                                onClick={() => setActiveTab("empresa")}
                            >
                                <Building2 size={18} /> Datos de Empresa
                            </button>
                        </li>
                        <li>
                            <button
                                className={activeTab === "sistema" ? "active font-bold" : ""}
                                onClick={() => setActiveTab("sistema")}
                            >
                                <Receipt size={18} /> Valores de Facturación
                            </button>
                        </li>
                        <li>
                            <button
                                className={activeTab === "apariencia" ? "active font-bold" : ""}
                                onClick={() => setActiveTab("apariencia")}
                            >
                                <Palette size={18} /> Apariencia
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Contenido */}
                <div className="flex-1">
                    <form onSubmit={handleSave} className="card bg-base-100 border border-base-200 shadow-sm relative overflow-hidden">
                        {loading && (
                            <div className="absolute inset-0 bg-base-100/50 z-10 flex items-center justify-center">
                                <span className="loading loading-spinner text-primary"></span>
                            </div>
                        )}

                        <div className="card-body">

                            {/* Sección Empresa */}
                            {activeTab === "empresa" && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h2 className="text-xl font-bold flex items-center gap-2 pb-2 border-b border-base-200">
                                        <Building2 className="text-primary" /> Datos de la Empresa
                                    </h2>
                                    <p className="text-sm opacity-60">Estos datos aparecerán en el encabezado de las facturas PDF.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label"><span className="label-text">Nombre Fantasía</span></label>
                                            <input type="text" className="input input-bordered" value={empresa.nombre} onChange={e => setEmpresa({ ...empresa, nombre: e.target.value })} />
                                        </div>
                                        <div className="form-control">
                                            <label className="label"><span className="label-text">Razón Social</span></label>
                                            <input type="text" className="input input-bordered" value={empresa.razonSocial} onChange={e => setEmpresa({ ...empresa, razonSocial: e.target.value })} />
                                        </div>
                                        <div className="form-control">
                                            <label className="label"><span className="label-text">CUIT</span></label>
                                            <input type="text" className="input input-bordered" value={empresa.cuit} onChange={e => setEmpresa({ ...empresa, cuit: e.target.value })} />
                                        </div>
                                        <div className="form-control">
                                            <label className="label"><span className="label-text">Email de Contacto</span></label>
                                            <input type="email" className="input input-bordered" value={empresa.email} onChange={e => setEmpresa({ ...empresa, email: e.target.value })} />
                                        </div>
                                        <div className="form-control md:col-span-2">
                                            <label className="label"><span className="label-text">Dirección Fiscal</span></label>
                                            <input type="text" className="input input-bordered" value={empresa.direccion} onChange={e => setEmpresa({ ...empresa, direccion: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sección Valores Sistema */}
                            {activeTab === "sistema" && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h2 className="text-xl font-bold flex items-center gap-2 pb-2 border-b border-base-200">
                                        <Receipt className="text-primary" /> Valores por Defecto
                                    </h2>
                                    <p className="text-sm opacity-60">Configura los valores iniciales para nuevas facturas.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label"><span className="label-text">Valor por KM ($)</span></label>
                                            <input
                                                type="number"
                                                className="input input-bordered"
                                                value={sistema.valorKmDefault}
                                                onChange={e => setSistema({ ...sistema, valorKmDefault: Number(e.target.value) })}
                                            />
                                            <label className="label"><span className="label-text-alt text-warning">Este valor se usará al crear una nueva factura.</span></label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sección Apariencia */}
                            {activeTab === "apariencia" && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h2 className="text-xl font-bold flex items-center gap-2 pb-2 border-b border-base-200">
                                        <Palette className="text-primary" /> Apariencia
                                    </h2>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                {theme === "dark" ? <Moon size={24} /> : <Sun size={24} />}
                                                <div>
                                                    <div className="font-bold">Tema del Sistema</div>
                                                    <div className="text-xs opacity-60">{theme === "dark" ? "Modo Oscuro Activo" : "Modo Claro Activo"}</div>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={theme === "dark"}
                                                onChange={toggleTheme}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer de Acciones (Solo para Empresa y Sistema) */}
                        {activeTab !== "apariencia" && (
                            <div className="card-actions justify-end p-4 bg-base-200/50 border-t border-base-200">
                                <button type="submit" className="btn btn-primary gap-2" disabled={loading}>
                                    <Save size={18} />
                                    {loading ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

            </div>
        </PageLayout>
    );
};

export default Configuracion;
