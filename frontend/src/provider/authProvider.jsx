import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axiosConfig";
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    const [token, setToken_] = useState(localStorage.getItem("token"));
    const [role, setRole_] = useState(localStorage.getItem("role"));

    const setToken = (newToken) => {
        setToken_(newToken);
    };

    const setRole = (newRole) => {
        setRole_(newRole || null);
    };

    useEffect(() => {
        if (token) {
            api.defaults.headers.common["Authorization"] = "Bearer " + token;
            localStorage.setItem("token", token);
        } else {
            delete api.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    }, [token]);

    useEffect(() => {
        if (role) {
            localStorage.setItem("role", role);
        } else {
            localStorage.removeItem("role");
        }
    }, [role]);

    const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

    const contextValue = useMemo(
        () => ({
            token,
            role,
            isAdmin,
            setToken,
            setRole,
        }),
        [token, role, isAdmin]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    return useContext(AuthContext);
};
export default AuthProvider;
