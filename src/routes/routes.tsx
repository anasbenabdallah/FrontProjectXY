// src/router/index.tsx
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Protected from "./protected";

const Navbar = lazy(() => import("../components/Navbar/Navbar"));
const DashboardPage = lazy(() => import("../Pages/Dashboard/Dashboard"));

const Login = lazy(() => import("../components/Auth/Login"));

// NOTE: keep your actual file name/casing; you wrote "sharedPage"
const SharedPage = lazy(() => import("../Pages/Shared/sharedPage"));

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },

  {
    path: "/dashboard",
    element: (
      <Protected>
        <Navbar />
      </Protected>
    ),
    children: [
      { index: true, element: <DashboardPage /> },

      { path: "utilisateurs", element: <SharedPage entity="users" /> },
      { path: "voitures", element: <SharedPage entity="cars" /> },
      { path: "chauffeurs", element: <SharedPage entity="drivers" /> },
      { path: "gps", element: <SharedPage entity="enums" /> },
    ],
  },

  { path: "*", element: <div>404 Not Found</div> },
]);
