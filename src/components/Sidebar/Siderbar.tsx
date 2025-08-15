// src/components/Sidebar/Sidebar.tsx
import { NavLink } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
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
        <NavLink end to="/dashboard" className="sf-link">
          <span>Tableau de bord</span>
        </NavLink>
        <NavLink to="/dashboard/missions" className="sf-link">
          <span>Missions</span>
        </NavLink>
        <NavLink to="/dashboard/carte-interactif" className="sf-link">
          <span>Carte interactif</span>
        </NavLink>{" "}
        <NavLink to="/dashboard/Rapports" className="sf-link">
          <span>Rapports</span>
        </NavLink>{" "}
        <NavLink to="/dashboard/Maintenance" className="sf-link">
          <span>Maintenance</span>
        </NavLink>
        {/* Important: go to configuration's default tab */}
        <NavLink to="/dashboard/configuration/utilisateurs" className="sf-link">
          <span>Configuration</span>
        </NavLink>
      </nav>

      <div className="sf-footer">
        <span>© 2025</span>
      </div>
    </aside>
  );
}
