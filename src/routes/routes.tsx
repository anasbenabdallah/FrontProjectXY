// src/router/index.tsx
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Protected from "./protected";

const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));
const DashboardPage = lazy(() => import("../Pages/Dashboard/Dashboard"));
const Login = lazy(() => import("../components/Auth/Login"));
const SharedPage = lazy(() => import("../Pages/Shared/sharedPage"));
const AffectationsPage = lazy(
  () => import("../Pages/Affectations/AffectationsPage")
);
const ConfigurationLayout = lazy(
  () => import("../Pages/Configuration/ConfigurationLayout")
);
const SetPasswordPage = lazy(
  () => import("../Pages/authentification/SetPassword")
);
const CarteInteractivePage = lazy(
  () => import("../Pages/CarteInteractive/CarteInteractive")
);

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/set-password", element: <SetPasswordPage /> },

  {
    path: "/dashboard",
    element: (
      <Protected>
        <DashboardLayout /> {/* Sidebar + Outlet */}
      </Protected>
    ),
    children: [
      { index: true, element: <DashboardPage /> }, // /dashboard
      { path: "carte-interactif", element: <CarteInteractivePage /> }, // 🔹 ajout ici

      // /dashboard/configuration/*
      {
        path: "configuration",
        element: <ConfigurationLayout />, // tabs + <Outlet/>
        children: [
          { index: true, element: <Navigate to="utilisateurs" replace /> },
          { path: "utilisateurs", element: <SharedPage entity="users" /> },
          { path: "voitures", element: <SharedPage entity="cars" /> },
          { path: "chauffeurs", element: <SharedPage entity="drivers" /> },
          { path: "gps", element: <SharedPage entity="gps" /> },
          { path: "affectations", element: <AffectationsPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <div>404 Not Found</div> },
]);
