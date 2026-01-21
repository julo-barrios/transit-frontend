import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Future improvement: Check for active tenantId here
    // if (!tenantId) { return <Navigate to="/select-tenant" /> }

    return <Outlet />;
}
