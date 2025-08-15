// src/layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Siderbar";
import Topbar from "../components/TopBar/Topbar";
import "./dashboard-layout.css";

export default function DashboardLayout() {
  return (
    <div className="sf-shell">
      <Sidebar />
      <div className="sf-main">
        <Topbar />
        <div className="sf-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
