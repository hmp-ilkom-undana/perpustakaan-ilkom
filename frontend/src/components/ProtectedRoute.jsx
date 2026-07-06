import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles = [] }) {
    const { session, isPending } = useAuth();

    if (isPending) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-200">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
                    <p className="font-medium">Memuat sesi...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
