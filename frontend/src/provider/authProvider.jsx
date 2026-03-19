import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken_] = useState(localStorage.getItem("token"));

    // Helper: Decodes the base64 token to extract username and role
    const getRolesFromToken = (t) => {
        if (!t || typeof t !== "string") return [];
        try {
            // Decode base64 token
            const decoded = atob(t);
            // Token format: username:timestamp
            const parts = decoded.split(":");
            // Role is not in token, so fallback to localStorage or context
            // If you want to use role, you can store it separately or update backend to include it in token
            // For now, just return empty array
            return [];
        } catch (e) {
            console.error("Failed to decode token", e);
            return [];
        }
    };

    const roles = useMemo(() => getRolesFromToken(token), [token]);

    const setToken = (newToken) => {
        setToken_(newToken);
        if (newToken) {
            localStorage.setItem("token", newToken);
        } else {
            localStorage.removeItem("token");
        }
    };

    const contextValue = useMemo(
        () => ({
            token,
            roles,
            isAdmin: roles.includes("ROLE_ADMIN"),
            setToken,
        }),
        [token, roles]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;