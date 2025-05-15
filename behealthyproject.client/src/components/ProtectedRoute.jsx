
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './auth';

const ProtectedRoute = ({ children, requiredRole }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/unauthorized" replace />;
    }

    const role = getUserRole();
    if (requiredRole && role?.toLowerCase() !== requiredRole.toLowerCase()) {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
};
export default ProtectedRoute;
