// src/components/Sidebar/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // ✅
import "./sidebar.css";

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || user?.data?.type; // récupération du rôle

  return (
    <aside className="sf-sidebar">
      <div className="sf-brand">
        <div className="sf-logo">SF</div>
        <div className="sf-brand-text">
          <div className="sf-brand-mini">SMART</div>
          <div className="sf-brand-name">FLEET</div>
        </div>
      </div>

      <nav className="sf-nav">
        {/* Accessible à tous sauf conducteur */}
        {role !== "conducteur" && (
          <NavLink end to="/dashboard" className="sf-link">
            <span>Tableau de bord</span>
          </NavLink>
        )}

        {role !== "conducteur" && (
          <NavLink to="/dashboard/missions" className="sf-link">
            <span>Missions</span>
          </NavLink>
        )}

        {/* Carte interactif → visible pour tout le monde */}
        <NavLink to="/dashboard/carte-interactif" className="sf-link">
          <span>Carte interactif</span>
        </NavLink>

        {role !== "conducteur" && (
          <NavLink to="/dashboard/rapports" className="sf-link">
            <span>Rapports</span>
          </NavLink>
        )}

        {role !== "conducteur" && (
          <NavLink to="/dashboard/maintenance" className="sf-link">
            <span>Maintenance</span>
          </NavLink>
        )}

        {role !== "conducteur" && (
          <NavLink
            to="/dashboard/configuration/utilisateurs"
            className="sf-link"
          >
            <span>Configuration</span>
          </NavLink>
        )}
      </nav>

      <div className="sf-footer">
        <span>© 2025</span>
      </div>
    </aside>
  );
}
