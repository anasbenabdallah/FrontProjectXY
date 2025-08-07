import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import UserMenu from "../components/Menu/UserMenu";

export default function Dashboard() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* 🔹 Titre */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          {/* 🔹 Navigation */}
          <Box>
            <Button color="inherit" component={Link} to="utilisateurs">
              Utilisateurs
            </Button>
            <Button color="inherit" component={Link} to="voitures">
              Voitures
            </Button>
            <Button color="inherit" component={Link} to="chauffeurs">
              Chauffeurs
            </Button>

            {/* 🔹 Avatar + Menu */}
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>

      {/* 🔹 Contenu des pages enfants */}
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </>
  );
}
