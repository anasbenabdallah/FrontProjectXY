// src/Pages/Dashboard/Dashboard.tsx
import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Button, Stack } from "@mui/material";
import { fetchDashboardStats, type DashboardStats } from "../../api/dashboard";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const available =
    stats?.availableVehicles ??
    Math.max(0, (stats?.totalVehicles ?? 0) - (stats?.vehiclesInUse ?? 0));

  return (
    <Stack spacing={2}>
      {/* Header gradient */}
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          background: "linear-gradient(90deg, #5B6CFF 0%, #8A35FF 100%)",
          color: "white",
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          {t("dashboard.welcome")}
        </Typography>
        <Typography variant="body2">{t("dashboard.subtitle")}</Typography>
      </Box>

      {/* KPI cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">
              {t("dashboard.kpis.totalVehicles")}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {stats?.totalVehicles ?? 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">
              {t("dashboard.kpis.totalDrivers")}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {stats?.activeDrivers ?? 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">
              {t("dashboard.kpis.vehiclesInUse")}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {stats?.vehiclesInUse ?? 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">
              {t("dashboard.kpis.availableVehicles")}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {available}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick actions */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {t("dashboard.actions.title")}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" component={Link} to="/dashboard/voitures">
            {t("dashboard.actions.addVehicle")}
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/dashboard/chauffeurs"
          >
            {t("dashboard.actions.addDriver")}
          </Button>
          <Button variant="outlined" component={Link} to="/dashboard/gps">
            {t("dashboard.actions.addGps")}
          </Button>
        </Stack>
      </Paper>

      {/* Fleet overview */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {t("dashboard.overview.title")}
        </Typography>
        <Stack direction="row" spacing={4}>
          <Box>
            <Typography variant="body2">
              {t("dashboard.overview.available")}
            </Typography>
            <Typography variant="h6" color="success.main">
              {available}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              {t("dashboard.overview.inUse")}
            </Typography>
            <Typography variant="h6" color="warning.main">
              {stats?.vehiclesInUse ?? 0}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
