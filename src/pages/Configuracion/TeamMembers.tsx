import { useEffect, useState } from 'react';
import { userService, type TeamMember } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";

export default function TeamMembers() {
    const { tenantId, user } = useAuth();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Invite Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("user");
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

    const isAdmin = user?.role === 'admin';

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const data = await userService.getOrganizationMembers();
            setMembers(data);
        } catch (err: unknown) {
            console.error(err);
            setError("No se pudieron cargar los miembros del equipo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tenantId) {
            fetchMembers();
        }
    }, [tenantId]);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviteLoading(true);
        setError(null);
        setInviteSuccess(null);

        try {
            if (!tenantId) throw new Error("No hay organización activa.");

            // Call Backend Service
            await userService.inviteMember(inviteEmail, inviteRole, tenantId);

            setInviteSuccess(`Invitación enviada a ${inviteEmail}`);
            setInviteEmail("");
            setIsModalOpen(false);
            // Refresh list (simulate optimist update or fetch)
            fetchMembers();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Error enviando invitación";
            setError(message);
        } finally {
            setInviteLoading(false);
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center pb-2 border-b border-base-200">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <UserPlus className="text-primary" /> Miembro del Equipo
                </h2>
                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-sm btn-primary gap-2"
                    >
                        <UserPlus size={16} />
                        Invitar
                    </button>
                )}
            </div>

            <p className="text-sm opacity-60">Administra los usuarios que tienen acceso a tu organización.</p>

            {error && <div className="alert alert-error text-sm"><AlertCircle size={16} /> {error}</div>}
            {inviteSuccess && <div className="alert alert-success text-sm"><CheckCircle size={16} /> {inviteSuccess}</div>}

            <div className="overflow-x-auto border border-base-200 rounded-lg">
                <table className="table table-sm">
                    <thead className="bg-base-200/50">
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th className="text-right">Fecha Ingreso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10">
                                    <span className="loading loading-spinner text-primary"></span>
                                </td>
                            </tr>
                        ) : members.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-base-content/60">
                                    No hay miembros en esta organización aún.
                                </td>
                            </tr>
                        ) : (
                            members.map((member) => (
                                <tr key={member.id} className="hover:bg-base-100">
                                    <td>
                                        <div className="font-bold">{member.full_name || "Sin Nombre"}</div>
                                    </td>
                                    <td className="font-mono text-xs">{member.email}</td>
                                    <td>
                                        <div className={`badge ${member.role === 'admin' ? 'badge-primary' :
                                            member.role === 'driver' ? 'badge-accent' : 'badge-ghost'
                                            } badge-sm uppercase text-[10px]`}>
                                            {member.role}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="badge badge-success badge-xs gap-1">
                                            Activo
                                        </div>
                                    </td>
                                    <td className="text-right text-xs opacity-70">
                                        {new Date(member.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* INVITE MODAL */}
            {isModalOpen && (
                <dialog open className="modal bg-black/50">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Invitar Nuevo Miembro</h3>
                        <form onSubmit={handleInvite}>
                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="ejemplo@empresa.com"
                                    className="input input-bordered w-full"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-control w-full mb-6">
                                <label className="label">
                                    <span className="label-text">Rol</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                >
                                    <option value="user">Usuario (Solo ver)</option>
                                    <option value="manager">Manager (Editar)</option>
                                    <option value="driver">Conductor (App Móvil)</option>
                                    <option value="admin">Administrador (Total)</option>
                                </select>
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={inviteLoading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={inviteLoading}
                                >
                                    {inviteLoading ? <span className="loading loading-spinner loading-xs"></span> : null}
                                    Enviar Invitación
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </div>
    );
}
