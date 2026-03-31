import { Navigate } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../auth";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!isAuthenticated()) {
        // Егер тіркелмеген болса - логинге жіберу
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin()) {
        // Егер админ бетіне жай қолданушы кірсе - басты бетке жіберу
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;