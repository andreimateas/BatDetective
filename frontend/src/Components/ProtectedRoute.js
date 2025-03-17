import React, { useState, useEffect } from 'react';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import {checkToken, getUserRole} from "../API/Authentication";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
    const [isTokenValid, setIsTokenValid] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const userRole = getUserRole();


    useEffect(() => {
        const validateToken = async () => {
            const result = await checkToken();
            setIsTokenValid(result);
        };

        validateToken();
    }, [location.pathname, navigate]);

    if (isTokenValid === null) {
        return <Spinner/>;
    }
    if (isTokenValid === false) {
        return <Navigate to="/login" state={{ error: 'Please log in first!' }} />;
    }
    if(userRole!=='ADMIN' && location.pathname==="/reports"){
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;
