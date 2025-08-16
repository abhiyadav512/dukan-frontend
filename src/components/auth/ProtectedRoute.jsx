import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getStoredUser } from "../../../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
    const token = localStorage.getItem("token");
    const user = getStoredUser();
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    try {
        // Decode the JWT token and check if it has expired; if expired or invalid, remove it, log the user out, and redirect to login.
        const decoded = jwtDecode(token);
        // console.log(decoded);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return <Navigate to="/login" replace />;
        }
    } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;