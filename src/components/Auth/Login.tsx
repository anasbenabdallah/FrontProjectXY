import { useState } from "react";
import api from "../../api/api";
import "./../../styles/AuthForm.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
interface LoginForm {
  email: string;
  motDePasse: string;
  code2FA?: string;
}

export default function Login() {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    motDePasse: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Connexion réussie !");
      navigate("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      alert("Erreur connexion: " + (err instanceof Error ? err.message : ""));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="auth-input"
            name="motDePasse"
            type="password"
            placeholder="Mot de passe"
            value={form.motDePasse}
            onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
          />

          <button className="auth-button" type="submit">
            Se connecter
          </button>
        </form>
        <div className="auth-link">
          Pas encore de compte? <Link to="/register">S'inscrire</Link>
        </div>
      </div>
    </div>
  );
}
