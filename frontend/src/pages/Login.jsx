import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../provider/authProvider";
import api from "../api/axiosConfig";
const Login = () => {
    const { setToken, setRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const params = new URLSearchParams(location.search);
    const isExpired = params.get("expired") === "true";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // Call the Spring Boot AuthController
            const res = await api.post("/auth/login", { email, password });

            setToken(res.data.token);
            setRole(res.data.role);

            // Redirect to home page
            navigate("/", { replace: true });
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    };
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Sign In to Bookstore Admin</h2>
            {isExpired && (
                <p style={{ color: "#b26a00", fontWeight: 600 }}>
                    Your session has expired. Please sign in again.
                </p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleLogin} style={{ display: "inline-block", textAlign: "left" }}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Username:</label><br/>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <small style={{display:"block", color:"#888"}}>Hint: try 'admin'</small>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Password:</label><br/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" style={{ width: "100%" }}>Login</button>
            </form>
        </div>
    );
};
export default Login;
