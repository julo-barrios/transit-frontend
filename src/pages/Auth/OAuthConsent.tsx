import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function OAuthConsent() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Extract query params (standard OAuth)
    const clientName = searchParams.get('client_name') || 'Aplicación Externa';
    const scopes = searchParams.get('scope')?.split(' ') || ['perfil', 'email'];
    const redirectUri = searchParams.get('redirect_uri');
    const state = searchParams.get('state');

    const handleAllow = async () => {
        setLoading(true);
        // Simulate backend processing
        setTimeout(() => {
            setLoading(false);
            if (redirectUri) {
                // In a real flow, the backend would provide an Authorization Code
                // For now, we simulate returning to the client with a dummy code
                const separator = redirectUri.includes('?') ? '&' : '?';
                window.location.href = `${redirectUri}${separator}code=mock_auth_code_123&state=${state || ''}`;
            } else {
                alert("Error: No redirect_uri provided in request.");
            }
        }, 1000);
    };

    const handleDeny = () => {
        if (redirectUri) {
            const separator = redirectUri.includes('?') ? '&' : '?';
            window.location.href = `${redirectUri}${separator}error=access_denied&state=${state || ''}`;
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card w-full max-w-lg bg-base-100 shadow-xl">
                <div className="card-body items-center text-center space-y-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <ShieldCheck size={48} className="text-primary" />
                    </div>

                    <h1 className="card-title text-2xl font-bold">Solicitud de Acceso</h1>
                    <p className="text-base-content/80">
                        La aplicación <span className="font-bold">{clientName}</span> solicita acceso a tu cuenta.
                    </p>

                    <div className="w-full text-left bg-base-200 rounded-lg p-4 mt-4">
                        <h3 className="text-sm font-bold uppercase opacity-60 mb-2">Permisos solicitados:</h3>
                        <ul className="space-y-2">
                            {scopes.map((scope, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                    <AlertCircle size={16} className="text-success" />
                                    <span>{scope}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card-actions justify-end w-full pt-6 gap-3">
                        <button
                            className="btn btn-ghost"
                            onClick={handleDeny}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn btn-primary px-8"
                            onClick={handleAllow}
                            disabled={loading}
                        >
                            {loading ? <span className="loading loading-spinner"></span> : "Permitir"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
