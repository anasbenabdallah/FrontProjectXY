import { useState } from "react";
import "../../styles/AuthForm.css";
import { useNavigate } from "react-router-dom";
import type { LoginPayload } from "../../types/auth";
import { login } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth.tsx";

export default function Login() {
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const navigate = useNavigate();
  const { loginLocal } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await login(form); // { email, password }
      loginLocal(res.token, res.user);
      navigate("/dashboard", { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion</h2>

        {err && <div className="auth-error">{err}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="auth-input"
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Registration temporarily removed */}
      </div>
    </div>
  );
}
