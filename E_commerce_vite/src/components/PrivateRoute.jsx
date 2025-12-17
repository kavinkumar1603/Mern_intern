import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userRole = sessionStorage.getItem('userRole');
    
    // Check if user is logged in
    if (!isLoggedIn || isLoggedIn !== 'true') {
        return <Navigate to="/login" replace />;
    }
    
    // Check if user is admin
    if (userRole !== 'admin') {
        return <Navigate to="/orders" replace />;
    }
    
    return children;
}

export default PrivateRoute