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
  Box,
  Stack,
  Typography,
} from "@mui/material";
import type { EntityType, SharedDoc } from "../../types/shared";
import {
  listEntities,
  createEntity,
  updateEntity,
  deleteEntity,
} from "../../api/shared";
import { configs, type EntityConfig, type FieldDef } from "./sharedConfigs";

type Props = { entity: EntityType };

type AnyData = Record<string, any>;

export default function SharedPage({ entity }: Props) {
  const cfg: EntityConfig = useMemo(() => configs[entity], [entity]);

  const [rows, setRows] = useState<SharedDoc<AnyData>[]>([]);
  const [form, setForm] = useState<AnyData>({});
  const [status, setStatus] = useState<boolean>(true);
  const [editing, setEditing] = useState<SharedDoc<AnyData> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setErr(null);
      // ← filter to active only
      const data = await listEntities<AnyData>(entity, { status: true });
      setRows(data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm({});
    setStatus(true);
    setEditing(null);
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  const onChangeField = (field: FieldDef, value: string) =>
    setForm((prev) => ({ ...prev, [field.name]: value }));

  const onChangeEditField = (field: FieldDef, value: string) =>
    setEditing((prev) =>
      prev ? { ...prev, data: { ...prev.data, [field.name]: value } } : prev
    );

  const handleCreate = async () => {
    try {
      await createEntity<AnyData>(entity, { data: form, status });
      setForm({});
      setStatus(true);
      fetchAll();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Erreur création");
    }
  };

  const handleUpdate = async () => {
    if (!editing?._id) return;
    try {
      await updateEntity<AnyData>(entity, editing._id, {
        data: editing.data,
        status: editing.status,
      });
      setEditing(null);
      fetchAll();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Erreur mise à jour");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntity(entity, id, true); // soft delete
      setRows((prev) => prev.filter((x) => x._id !== id)); // ← remove from UI
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Erreur suppression");
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{cfg.title}</Typography>

      {err && <Alert severity="error">{err}</Alert>}

      {/* Create form */}
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {cfg.fields.map((f) => (
            <TextField
              key={f.name}
              label={f.label}
              value={form[f.name] ?? ""}
              onChange={(e) => onChangeField(f, e.target.value)}
              required={!!f.required}
              sx={{ minWidth: 220 }}
            />
          ))}
          <Select
            value={status ? "true" : "false"}
            onChange={(e) => setStatus(e.target.value === "true")}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="true">Actif</MenuItem>
            <MenuItem value="false">Inactif</MenuItem>
          </Select>

          <Button variant="contained" onClick={handleCreate} disabled={loading}>
            {loading ? "..." : "Ajouter"}
          </Button>
        </Stack>
      </Paper>

      {/* List table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {cfg.fields.map((f) => (
                <TableCell key={f.name}>{f.label}</TableCell>
              ))}
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r._id}>
                {cfg.fields.map((f) => (
                  <TableCell key={f.name}>{r.data?.[f.name]}</TableCell>
                ))}
                <TableCell>{r.status ? "Actif" : "Inactif"}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => setEditing(r)}
                    sx={{ mr: 1 }}
                  >
                    Éditer
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(r._id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={cfg.fields.length + 2} align="center">
                  Aucun élément
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit dialog */}
      <Dialog
        open={!!editing}
        onClose={() => setEditing(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Modifier</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack gap={2}>
            {cfg.fields.map((f) => (
              <TextField
                key={f.name}
                label={f.label}
                value={editing?.data?.[f.name] ?? ""}
                onChange={(e) => onChangeEditField(f, e.target.value)}
                required={!!f.required}
              />
            ))}
            <Select
              value={editing?.status ? "true" : "false"}
              onChange={(e) =>
                setEditing((prev) =>
                  prev ? { ...prev, status: e.target.value === "true" } : prev
                )
              }
            >
              <MenuItem value="true">Actif</MenuItem>
              <MenuItem value="false">Inactif</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Annuler</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
