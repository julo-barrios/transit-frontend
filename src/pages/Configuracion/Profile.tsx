import PageLayout from "@/components/Layout/PageLayout";
import { Mail, Shield, Building, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
    const { user, tenantId } = useAuth();

    if (!user) {
        return <div>Cargando perfil...</div>;
    }

    const lastSignIn = user.last_sign_in_at
        ? new Date(user.last_sign_in_at).toLocaleString()
        : 'Desconocido';

    const provider = user.app_metadata.provider || 'email';
    const email = user.email;

    // Supabase auth metadata often stores name/avatar in user_metadata
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Usuario';
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

    return (
        <PageLayout
            title="Mi Perfil"
            breadcrumbs={["Inicio", "Configuración", "Perfil"]}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Profile Card */}
                <div className="md:col-span-2 space-y-6">
                    <div className="card bg-base-100 shadow-sm border border-base-200">
                        <div className="card-body">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full w-24 ring ring-primary ring-offset-base-100 ring-offset-2">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" />
                                        ) : (
                                            <span className="text-3xl font-bold uppercase">{email?.substring(0, 2)}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-center sm:text-left space-y-1">
                                    <h2 className="text-2xl font-bold">{fullName}</h2>
                                    <p className="text-base-content/60 flex items-center justify-center sm:justify-start gap-2">
                                        <Mail size={14} /> {email}
                                    </p>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                                        <div className="badge badge-primary badge-outline gap-1 capitalize">
                                            {provider}
                                        </div>
                                        <div className="badge badge-ghost gap-1">
                                            {(user as any).role || 'user'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-sm border border-base-200">
                        <div className="card-body">
                            <h3 className="card-title text-lg mb-4">Detalles de la Cuenta</h3>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-start gap-3 p-3 bg-base-200/50 rounded-lg">
                                    <div className="mt-1 p-2 bg-base-100 rounded-md">
                                        <Clock size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold opacity-60 uppercase">Último Inicio de Sesión</p>
                                        <p className="text-sm">{lastSignIn}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="card bg-base-100 shadow-sm border border-base-200">
                        <div className="card-body">
                            <h3 className="card-title text-lg flex items-center gap-2">
                                <Building size={20} className="text-secondary" />
                                Organización
                            </h3>
                            <div className="divider my-1"></div>

                            <div className="py-2">
                                <p className="text-xs font-bold opacity-60 uppercase mb-1">Nombre</p>
                                <div className="flex items-center gap-2 p-2 bg-base-200 rounded font-medium break-all text-lg">
                                    {(user as any).app_metadata?.tenant_name || tenantId || "No asignado"}
                                </div>
                                <p className="text-[10px] mt-2 opacity-60">
                                    Organización activa a la que pertenece tu usuario.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-warning/10 border border-warning/20 shadow-sm">
                        <div className="card-body">
                            <h3 className="card-title text-sm text-warning flex items-center gap-2">
                                <Shield size={16} />
                                Zona Segura
                            </h3>
                            <p className="text-xs opacity-80">
                                Tu sesión está protegida y encriptada. Si detectas actividad inusual, contacta a soporte inmediatamente.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Profile;
