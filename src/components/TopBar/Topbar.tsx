// src/components/Topbar/Topbar.tsx
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // you already have this
import "./topbar.css";
import UserMenu from "../Menu/UserMenu";

function sectionTitle(pathname: string): string {
  // pick the first segment after /dashboard
  // and map it to a pretty title
  if (pathname.startsWith("/dashboard/configuration")) return "Configuration";
  if (pathname.startsWith("/dashboard/missions")) return "Missions";
  if (pathname.startsWith("/dashboard/carte")) return "Carte Interactif";
  if (pathname.startsWith("/dashboard/rapports")) return "Rapports";
  if (pathname.startsWith("/dashboard/maintenance")) return "Maintenance";
  // default
  return "Tableau de bord";
}

export default function Topbar() {
  const { pathname } = useLocation();
  const title = sectionTitle(pathname);

  const { user } = useAuth(); // { name, role, ... }
  const email = user?.data?.email || "Utilisateur inconnu";
  const role = user?.role || "Rôle inconnu";
  const initials = email
    ? email
        .split("@")[0] // prendre partie avant @
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <header className="sf-topbar">
      <div className="sf-topbar-left">
        <h1 className="sf-topbar-title">{title}</h1>
      </div>

      <div className="sf-topbar-right">
        <div className="sf-topbar-user">
          <div className="sf-topbar-user-name">{email}</div>
          <div className="sf-topbar-user-role">{role}</div>
        </div>

        {/* ✅ Menu utilisateur */}
        <UserMenu initials={initials} email={email} />
      </div>
    </header>
  );
}
