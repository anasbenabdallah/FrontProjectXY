import { lazy, Suspense, useState } from "react";
import { Box, Paper, Tabs, Tab } from "@mui/material";
import { useTranslation } from "react-i18next";

// lazy load existing screens
const SharedPage = lazy(() => import("../Shared/sharedPage"));
const AffectationsPage = lazy(() => import("../Affectations/AffectationsPage"));

type TabKey = "users" | "cars" | "drivers" | "gps" | "affectations";

function TabPanel(props: {
  value: TabKey;
  current: TabKey;
  children: React.ReactNode;
}) {
  const { value, current, children } = props;
  if (value !== current) return null;
  return <Box sx={{ mt: 2 }}>{children}</Box>;
}

export default function ConfigurationPage() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState<TabKey>("users");

  return (
    <Paper sx={{ p: 2 }}>
      <Tabs
        value={current}
        onChange={(_, v) => setCurrent(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab value="users" label={t("nav.users")} />
        <Tab value="cars" label={t("nav.cars")} />
        <Tab value="drivers" label={t("nav.drivers")} />
        <Tab value="gps" label={t("nav.gps")} />
        <Tab value="affectations" label="Affectations" />
      </Tabs>

      <Suspense fallback={<Box sx={{ p: 2 }}>Loading…</Box>}>
        <TabPanel value="users" current={current}>
          <SharedPage entity="users" />
        </TabPanel>

        <TabPanel value="cars" current={current}>
          <SharedPage entity="cars" />
        </TabPanel>

        <TabPanel value="drivers" current={current}>
          <SharedPage entity="drivers" />
        </TabPanel>

        <TabPanel value="gps" current={current}>
          <SharedPage entity="gps" />
        </TabPanel>

        <TabPanel value="affectations" current={current}>
          <AffectationsPage />
        </TabPanel>
      </Suspense>
    </Paper>
  );
}
