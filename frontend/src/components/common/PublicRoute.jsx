import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function PublicRoute({ children }) {

    const { user } = useAuth();

    if (!user) {
        return children;
    }

    switch (user.role) {

        case "ADMIN":
            return <Navigate to="/admin/dashboard" replace />;

        case "PARTNER":
            return <Navigate to="/partner/dashboard" replace />;

        default:
            return <Navigate to="/customer/dashboard" replace />;
    }
}

export default PublicRoute;