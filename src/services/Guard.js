import { Navigate, replace, useLocation } from "react-router-dom";
import  { apiService } from "./api";


export const CustomerRoute = ({ element: Component }) => {

    const location = useLocation();

    return apiService.isCustomer() ? (
        Component
    ) : (
        <Navigate to="/login" replace state={{ from: location }} />
    );
}

export const AuditorRoute = ({ element: Component }) => {

    const location = useLocation();

    return apiService.isAuditor() || apiService.isAdmin() ? (
        Component
    ) : (
        <Navigate to="/login" replace state={{ from: location }} />
    );
}