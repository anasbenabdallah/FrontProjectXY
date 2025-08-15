import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import LanguageSwitcher from "../Language/LanguageSwitcher";
import UserMenu from "../Menu/UserMenu";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
            }}
            component={Link}
            to="/dashboard"
          >
            {t("app.dashboard")}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button color="inherit" component={Link} to="utilisateurs">
              {t("nav.users")}
            </Button>
            <Button color="inherit" component={Link} to="voitures">
              {t("nav.cars")}
            </Button>
            <Button color="inherit" component={Link} to="chauffeurs">
              {t("nav.drivers")}
            </Button>
            <Button color="inherit" component={Link} to="gps">
              {t("nav.gps")}
            </Button>
            <Button color="inherit" component={Link} to="affectations">
              {t("affect.title")}
            </Button>

            <LanguageSwitcher />
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </>
  );
}
