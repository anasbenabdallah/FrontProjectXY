import { usePermissions } from "../../hooks/usePermissions";
import { Navigate } from "react-router-dom";

export default function CarteInteractive() {
  const { can } = usePermissions();

  // Autoriser uniquement conducteur, admin, super_admin
  if (!can("carte-interactive", "read")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <h1>Carte Interactive</h1>
      {/* Ici, ton composant OpenStreetMap ou Leaflet */}
    </div>
  );
}
