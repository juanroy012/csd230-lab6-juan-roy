import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../provider/authProvider";
const Logout = () => {
    const { setToken, setRole } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        setToken(null);
        setRole(null);
        navigate("/login", { replace: true });
    }, [setToken, setRole, navigate]);
    return <div>Logging out...</div>;
};
export default Logout;
