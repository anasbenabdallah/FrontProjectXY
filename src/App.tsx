import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Dashboard from "./Pages/Dashboard";
import UtilisateursPage from "./Pages/UtilisateursPage";
import VoituresPage from "./Pages/VoituresPage";
import ChauffeursPage from "./Pages/ChauffeursPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="utilisateurs" element={<UtilisateursPage />} />
          <Route path="voitures" element={<VoituresPage />} />
          <Route path="chauffeurs" element={<ChauffeursPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
