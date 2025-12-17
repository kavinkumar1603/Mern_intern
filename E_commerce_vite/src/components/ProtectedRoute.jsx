import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

export default ProtectedRoute