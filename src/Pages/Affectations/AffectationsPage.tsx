// src/Pages/Affectation/AffectationsPage.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Alert,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  listEntities,
  createEntity,
  updateEntity,
  deleteEntity,
} from "../../api/shared";
import type { SharedDoc } from "../../types/shared";
import { usePermissions } from "../../hooks/usePermissions";

type CarData = { marque: string; modele?: string; immatriculation: string };
type DriverData = {
  nom: string;
  prenom?: string;
  email?: string;
  tel?: string;
};
type GpsData = {
  attr?: string;
  value?: string;
  groupId?: string;
  description?: string;
};

type AffectData = {
  carId: string;
  driverId: string;
  gpsId?: string;
  startAt?: string;
  endAt?: string;
  notes?: string;
};
type AffectDoc = SharedDoc<AffectData>;

export default function AffectationsPage() {
  const { t } = useTranslation();
  const { can } = usePermissions();

  // lists
  const [cars, setCars] = useState<SharedDoc<CarData>[]>([]);
  const [drivers, setDrivers] = useState<SharedDoc<DriverData>[]>([]);
  const [gpsList, setGpsList] = useState<SharedDoc<GpsData>[]>([]);
  const [rows, setRows] = useState<AffectDoc[]>([]);

  // create form
  const [carId, setCarId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [gpsId, setGpsId] = useState("");
  const [notes, setNotes] = useState("");

  // edit dialog
  const [editing, setEditing] = useState<AffectDoc | null>(null);
  const [editCarId, setEditCarId] = useState("");
  const [editDriverId, setEditDriverId] = useState("");
  const [editGpsId, setEditGpsId] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState<"true" | "false">("true");

  // misc
  const [err, setErr] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // busy lookups (active assignments)
  const busyCarIds = useMemo(
    () =>
      new Set(rows.filter((r) => r.status).map((r) => String(r.data.carId))),
    [rows]
  );
  const busyDriverIds = useMemo(
    () =>
      new Set(rows.filter((r) => r.status).map((r) => String(r.data.driverId))),
    [rows]
  );

  const labelCar = (c?: SharedDoc<CarData>) =>
    c
      ? `${c.data.marque}${c.data.modele ? " " + c.data.modele : ""} • ${
          c.data.immatriculation
        }`
      : "";
  const labelDriver = (d?: SharedDoc<DriverData>) =>
    d ? `${d.data.nom}${d.data.prenom ? " " + d.data.prenom : ""}` : "";
  const labelGps = (g?: SharedDoc<GpsData>) =>
    g
      ? g.data.value || g.data.description || g.data.groupId || String(g._id)
      : "";

  const fetchAll = async () => {
    try {
      setErr(null);
      const [carList, driverList, affList, gpsItems] = await Promise.all([
        listEntities<CarData>("cars", { status: true }),
        listEntities<DriverData>("drivers", { status: true }),
        listEntities<AffectData>("affectations", { status: true }),
        listEntities<GpsData>("gps", { status: true }),
      ]);
      setCars(carList);
      setDrivers(driverList);
      setRows(affList as AffectDoc[]);
      setGpsList(gpsItems);
    } catch (e: any) {
      setErr(e?.response?.data?.message || t("common.loadError", "Load error"));
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreate = async () => {
    try {
      setCreating(true);
      await createEntity<AffectData>("affectations", {
        status: true,
        data: { carId, driverId, gpsId: gpsId || undefined, notes },
      });
      setCarId("");
      setDriverId("");
      setGpsId("");
      setNotes("");
      fetchAll();
    } catch (e: any) {
      setErr(
        e?.response?.data?.message || t("common.createError", "Create error")
      );
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (r: AffectDoc) => {
    setEditing(r);
    setEditCarId(String(r.data.carId || ""));
    setEditDriverId(String(r.data.driverId || ""));
    setEditGpsId(String(r.data.gpsId || ""));
    setEditNotes(r.data.notes || "");
    setEditStatus(r.status ? "true" : "false");
  };

  const handleSaveEdit = async () => {
    if (!editing?._id) return;
    try {
      setSaving(true);
      const willBeActive = editStatus === "true";
      await updateEntity<AffectData>("affectations", editing._id, {
        status: willBeActive,
        data: {
          carId: editCarId,
          driverId: editDriverId,
          gpsId: editGpsId || undefined,
          notes: editNotes,
        },
      });

      if (!willBeActive) {
        setRows((prev) => prev.filter((x) => x._id !== editing._id));
      } else {
        setRows((prev) =>
          prev.map((x) =>
            x._id === editing._id
              ? {
                  ...x,
                  status: true,
                  data: {
                    ...x.data,
                    carId: editCarId,
                    driverId: editDriverId,
                    gpsId: editGpsId || undefined,
                    notes: editNotes,
                  },
                }
              : x
          )
        );
      }
      setEditing(null);
    } catch (e: any) {
      setErr(e?.response?.data?.message || t("common.saveError", "Save error"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await deleteEntity("affectations", id);
      setRows((prev) => prev.filter((r) => r._id !== id));
    } catch (e: any) {
      setErr(
        e?.response?.data?.message || t("common.deleteError", "Delete error")
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t("affect.title", "Affectations")}</Typography>

      {err && <Alert severity="error">{err}</Alert>}

      {/* Create form → seulement si l'utilisateur a la permission "create" */}
      {can("affectations", "create") && (
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
            <Select
              displayEmpty
              value={carId}
              onChange={(e) => setCarId(e.target.value)}
              sx={{ minWidth: 260 }}
            >
              <MenuItem value="" disabled>
                {t("missions.chooseCar")}
              </MenuItem>
              {cars.map((c) => (
                <MenuItem
                  key={c._id}
                  value={c._id}
                  disabled={busyCarIds.has(String(c._id))}
                >
                  {labelCar(c)}
                  {busyCarIds.has(String(c._id))
                    ? t("affect.busyTag", " — (busy)")
                    : ""}
                </MenuItem>
              ))}
            </Select>

            <Select
              displayEmpty
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="" disabled>
                {t("missions.chooseDriver")}
              </MenuItem>
              {drivers.map((d) => (
                <MenuItem
                  key={d._id}
                  value={d._id}
                  disabled={busyDriverIds.has(String(d._id))}
                >
                  {labelDriver(d)}
                  {busyDriverIds.has(String(d._id))
                    ? t("affect.busyTag", " — (busy)")
                    : ""}
                </MenuItem>
              ))}
            </Select>

            <Select
              displayEmpty
              value={gpsId}
              onChange={(e) => setGpsId(e.target.value)}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="">{t("missions.chooseGps")}</MenuItem>
              {gpsList.map((g) => (
                <MenuItem key={g._id} value={g._id}>
                  {labelGps(g)}
                </MenuItem>
              ))}
            </Select>

            <TextField
              label={t("affect.notes", "Notes")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ minWidth: 260 }}
            />

            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={creating || !carId || !driverId}
            >
              {creating
                ? t("affect.creating", "Creating...")
                : t("affect.assign", "Assign")}
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Active assignments */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("missions.car")}</TableCell>
              <TableCell>{t("missions.driver")}</TableCell>
              <TableCell>{t("missions.gps")}</TableCell>
              <TableCell>{t("missions.start")}</TableCell>
              <TableCell>{t("affect.notes", "Notes")}</TableCell>
              <TableCell align="right">{t("common.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => {
              const car = cars.find(
                (c) => String(c._id) === String(r.data.carId)
              );
              const driver = drivers.find(
                (d) => String(d._id) === String(r.data.driverId)
              );
              const gps = gpsList.find(
                (g) => String(g._id) === String(r.data.gpsId)
              );
              return (
                <TableRow key={r._id}>
                  <TableCell>{labelCar(car)}</TableCell>
                  <TableCell>{labelDriver(driver)}</TableCell>
                  <TableCell>{labelGps(gps) || "—"}</TableCell>
                  <TableCell>
                    {r.data.startAt
                      ? new Date(r.data.startAt).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell>{r.data.notes || "—"}</TableCell>
                  <TableCell align="right">
                    {/* Bouton Modifier seulement si "update" */}
                    {can("affectations", "update") && (
                      <Button
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => openEdit(r)}
                      >
                        {t("common.edit")}
                      </Button>
                    )}
                    {/* Bouton Supprimer seulement si "delete" */}
                    {can("affectations", "delete") && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(r._id)}
                        disabled={deleting === r._id}
                      >
                        {deleting === r._id
                          ? t("affect.deleting", "Deleting...")
                          : t("common.delete")}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {t("affect.empty", "No active assignments")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box>
        <Button variant="text" onClick={fetchAll}>
          {t("common.refresh", "Refresh")}
        </Button>
      </Box>

      {/* Edit dialog seulement si permission update */}
      {can("affectations", "update") && (
        <Dialog
          open={!!editing}
          onClose={() => setEditing(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>{t("affect.editTitle", "Edit assignment")}</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Stack gap={2}>
              <Select
                value={editCarId}
                onChange={(e) => setEditCarId(e.target.value)}
                fullWidth
              >
                {cars.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {labelCar(c)}
                  </MenuItem>
                ))}
              </Select>

              <Select
                value={editDriverId}
                onChange={(e) => setEditDriverId(e.target.value)}
                fullWidth
              >
                {drivers.map((d) => (
                  <MenuItem key={d._id} value={d._id}>
                    {labelDriver(d)}
                  </MenuItem>
                ))}
              </Select>

              <Select
                value={editGpsId}
                onChange={(e) => setEditGpsId(e.target.value)}
                fullWidth
                displayEmpty
              >
                <MenuItem value="">{t("missions.chooseGps")}</MenuItem>
                {gpsList.map((g) => (
                  <MenuItem key={g._id} value={g._id}>
                    {labelGps(g)}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                label={t("affect.notes", "Notes")}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                fullWidth
              />

              <Select
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value as "true" | "false")
                }
                fullWidth
              >
                <MenuItem value="true">{t("affect.active", "Active")}</MenuItem>
                <MenuItem value="false">
                  {t("affect.closed", "Closed")}
                </MenuItem>
              </Select>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditing(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveEdit}
              disabled={saving}
            >
              {saving ? t("common.save", "Save") : t("common.save")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Stack>
  );
}
