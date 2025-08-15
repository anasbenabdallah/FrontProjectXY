// src/Pages/Auth/SetPassword.tsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (!token) {
      setErr("Lien invalide ou token manquant");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/set-password", {
        token: decodeURIComponent(token),
        password,
      });
      setMsg("Mot de passe créé avec succès. Redirection vers la connexion...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      setErr(
        error?.response?.data?.message ||
          "Erreur lors de la création du mot de passe"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Créer un mot de passe</h2>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
