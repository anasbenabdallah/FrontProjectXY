import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
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
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </>
  );
}
