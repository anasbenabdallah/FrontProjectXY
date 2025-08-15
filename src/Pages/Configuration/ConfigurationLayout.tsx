// src/Pages/Configuration/ConfigurationLayout.tsx
import { Tabs, Tab, Paper, Box } from "@mui/material";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const TABS = [
  { value: "utilisateurs", label: "UTILISATEURS" },
  { value: "voitures", label: "VOITURES" },
  { value: "chauffeurs", label: "CHAUFFEURS" },
  { value: "gps", label: "GPS" },
  { value: "affectations", label: "AFFECTATIONS" },
];

export default function ConfigurationLayout() {
  const { pathname } = useLocation();
  const current =
    TABS.find((t) => pathname.includes(`/configuration/${t.value}`))?.value ||
    "utilisateurs";

  return (
    <Paper sx={{ p: 2 }}>
      <Tabs value={current} variant="scrollable" scrollButtons="auto">
        {TABS.map((t) => (
          <Tab
            key={t.value}
            value={t.value}
            label={t.label}
            component={NavLink}
            to={`/dashboard/configuration/${t.value}`}
          />
        ))}
      </Tabs>

      <Box sx={{ mt: 2 }}>
        <Outlet />
      </Box>
    </Paper>
  );
}
