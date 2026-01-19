import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Bus, KeyRound } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, signInWithGoogle, signInWithMicrosoft, signInWithPassword, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ... (keep existing early returns)

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleGoogleLogin = async () => {
        // ... (existing code)
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al iniciar sesión con Google');
            setLoading(false);
        }
    };

    const handleMicrosoftLogin = async () => {
        // ... (existing code)
        setLoading(true);
        setError(null);
        try {
            await signInWithMicrosoft();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al iniciar sesión con Microsoft');
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signInWithPassword(email, password);
            // Navigation happens automatically via AuthContext state change
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al iniciar sesión. Verifique sus credenciales.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body items-center text-center space-y-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <Bus size={48} className="text-primary" />
                    </div>
                    <h1 className="card-title text-3xl font-bold">Bienvenido</h1>
                    <p className="text-base-content/60">Sistema de Gestión de Transporte</p>

                    {error && (
                        <div role="alert" className="alert alert-error text-sm text-left w-full">
                            <KeyRound size={18} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="w-full space-y-3 pt-4">
                        <button
                            onClick={handleGoogleLogin}
                            className="btn btn-outline w-full gap-3 hover:bg-base-200"
                            disabled={loading}
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            Continuar con Google
                        </button>

                        <button
                            onClick={handleMicrosoftLogin}
                            className="btn btn-outline w-full gap-3 hover:bg-base-200"
                            disabled={loading}
                        >
                            <img src="https://www.svgrepo.com/show/448239/microsoft.svg" className="w-5 h-5" alt="Microsoft" />
                            Continuar con Microsoft
                        </button>
                    </div>

                    <div className="divider">O ingresar con credenciales</div>

                    <form onSubmit={handleEmailLogin} className="w-full space-y-3 text-left">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="usuario@ejemplo.com"
                                className="input input-bordered w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Contraseña</span>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input input-bordered w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : "Iniciar Sesión"}
                        </button>
                    </form>

                    <p className="text-xs text-base-content/40 pt-4">
                        Si tienes problemas para ingresar, contacta al administrador del sistema.
                    </p>
                </div>
            </div>
        </div>
    );

}
