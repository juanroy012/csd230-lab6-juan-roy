import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../provider/authProvider";
import api from "../api/axiosConfig";
import { BookOpen, LogIn, AlertCircle } from "lucide-react";

const Login = () => {
    const { setToken, setRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const params = new URLSearchParams(location.search);
    const isExpired = params.get("expired") === "true";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); setLoading(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            setToken(res.data.token);
            setRole(res.data.role);
            navigate("/", { replace: true });
        } catch {
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', background: 'var(--clr-bg)',
            backgroundImage: 'radial-gradient(ellipse at 60% 20%, rgba(61,82,160,.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(72,202,228,.10) 0%, transparent 50%)',
        }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 60, height: 60, borderRadius: 16,
                        background: 'linear-gradient(135deg,#3D52A0,#9B72CF)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(61,82,160,.35)',
                    }}>
                        <BookOpen size={28} color="#fff" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--clr-text)', marginBottom: 4 }}>Libris</h1>
                    <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-3)' }}>Bookstore &amp; Media Catalog</p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'var(--clr-card)', border: '1px solid var(--clr-border)',
                    borderRadius: 20, padding: '32px 28px', boxShadow: '0 8px 32px rgba(0,0,0,.5)',
                }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>Sign in</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-3)', marginBottom: 24 }}>
                        Enter your credentials to access the system
                    </p>

                    {isExpired && (
                        <div className="alert alert-warn" style={{ marginBottom: 16 }}>
                            <AlertCircle size={15} />
                            Your session has expired. Please sign in again.
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: 16 }}>
                            <AlertCircle size={15} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="form-field">
                            <label className="form-label">Username</label>
                            <input
                                className="form-input"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="e.g. admin"
                                autoComplete="username"
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Password</label>
                            <input
                                className="form-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>
                        <button
                            className="btn btn-primary btn-full btn-lg"
                            type="submit"
                            disabled={loading}
                            style={{ marginTop: 4 }}
                        >
                            <LogIn size={16} />
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--clr-text-3)', marginTop: 20 }}>
                        Hint: try <span style={{ color: 'var(--clr-primary-l)', fontWeight: 600 }}>admin</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
