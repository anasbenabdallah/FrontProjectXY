import { useState } from "react";
import api from "../../api/api";
import "./../../styles/AuthForm.css";
import { Link } from "react-router-dom";

interface RegisterForm {
  nom: string;
  email: string;
  motDePasse: string;
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    nom: "",
    email: "",
    motDePasse: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      alert("Inscription réussie !");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Erreur: " + err.message);
      } else {
        alert("Erreur inconnue");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Inscription</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            name="nom"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
          />
          <input
            className="auth-input"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            className="auth-input"
            name="motDePasse"
            type="password"
            placeholder="Mot de passe"
            value={form.motDePasse}
            onChange={handleChange}
          />
          <button className="auth-button" type="submit">
            S'inscrire
          </button>
        </form>
        <div className="auth-link">
          Déjà inscrit? <Link to="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
