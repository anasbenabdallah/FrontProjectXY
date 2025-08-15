// src/Pages/Shared/SharedPage.tsx
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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { EntityType, SharedDoc } from "../../types/shared";
import {
  listEntities,
  createEntity,
  updateEntity,
  deleteEntity,
} from "../../api/shared";
import { configs, type EntityConfig, type FieldDef } from "./sharedConfigs";
import { usePermissions } from "../../hooks/usePermissions";

type Props = { entity: EntityType };
type AnyData = Record<string, any>;

export default function SharedPage({ entity }: Props) {
  const { t } = useTranslation();
  const { can } = usePermissions(); // ✅

  const cfg: EntityConfig = useMemo(() => configs[entity], [entity]);

  const isUsers = entity === "users";

  const [rows, setRows] = useState<SharedDoc<AnyData>[]>([]);
  const [form, setForm] = useState<AnyData>({});
  const [status, setStatus] = useState<boolean>(true);
  const [editing, setEditing] = useState<SharedDoc<AnyData> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const labelFor = (f: FieldDef) =>
    f.labelKey ? t(f.labelKey) : f.label ?? f.name;

  const fetchAll = async () => {
    try {
      setLoading(true);
      setErr(null);
      let data = await listEntities<AnyData>(entity, { status: true });

      if (isUsers) {
        data = data.map((u) => ({
          ...u,
          data: {
            ...u.data,
            role: u.data.type, // 🔹 copie le rôle pour l'affichage
          },
        }));
      }

      setRows(data);
    } catch (e: any) {
      setErr(
        e?.response?.data?.message ||
          t("common.errorLoading", "Erreur de chargement")
      );
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
      await createEntity<AnyData>(entity, {
        data: form,
        status: isUsers ? true : status,
      });
      setForm({});
      setStatus(true);
      fetchAll();
    } catch (e: any) {
      setErr(
        e?.response?.data?.message || t("common.errorCreate", "Erreur création")
      );
    }
  };

  const handleUpdate = async () => {
    if (!editing?._id) return;

    try {
      const id =
        typeof editing._id === "object"
          ? String(editing._id?.toString?.() || editing._id.$oid || "")
          : String(editing._id);

      let payloadData = { ...editing.data };
      if (isUsers && editing.data.role) {
        payloadData.type = editing.data.role; // map role → type for backend
        delete payloadData.role;
      }

      await updateEntity<AnyData>(
        entity, // type
        id, // id en 2ème
        {
          // payload en 3ème
          data: payloadData,
          status: isUsers ? true : editing.status,
        }
      );

      setEditing(null);
      fetchAll();
    } catch (e: any) {
      setErr(
        e?.response?.data?.message ||
          t("common.errorUpdate", "Erreur mise à jour")
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntity(entity, id);
      setRows((prev) => prev.filter((x) => x._id !== id));
    } catch (e: any) {
      setErr(
        e?.response?.data?.message ||
          t("common.errorDelete", "Erreur suppression")
      );
    }
  };

  const renderField = (
    f: FieldDef,
    value: string,
    onChange: (v: string) => void
  ) => {
    // Special dropdown for user roles
    if (isUsers && f.name === "role") {
      return (
        <Select
          key={f.name}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="conducteur">Conducteur</MenuItem>
          <MenuItem value="utilisateur">Utilisateur</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="super_admin">Super Admin</MenuItem>
        </Select>
      );
    }
    return (
      <TextField
        key={f.name}
        label={labelFor(f)}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        required={!!f.required}
        sx={{ minWidth: 220 }}
      />
    );
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t(cfg.titleKey)}</Typography>

      {err && <Alert severity="error">{err}</Alert>}

      {/* Create form */}
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {cfg.fields.map((f) =>
            renderField(f, form[f.name] ?? "", (v) => onChangeField(f, v))
          )}
          {!isUsers && (
            <Select
              value={status ? "true" : "false"}
              onChange={(e) => setStatus(e.target.value === "true")}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="true">{t("common.active")}</MenuItem>
              <MenuItem value="false">{t("common.inactive")}</MenuItem>
            </Select>
          )}
          <Button variant="contained" onClick={handleCreate} disabled={loading}>
            {t("common.add")}
          </Button>
        </Stack>
      </Paper>

      {/* List table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {cfg.fields.map((f) => (
                <TableCell key={f.name}>{labelFor(f)}</TableCell>
              ))}
              <TableCell>{t("common.status")}</TableCell>
              <TableCell>{t("common.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r._id}>
                {cfg.fields.map((f) => (
                  <TableCell key={f.name}>{r.data?.[f.name]}</TableCell>
                ))}
                <TableCell>
                  {r.status ? t("common.active") : t("common.inactive")}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => setEditing(r)}
                    sx={{ mr: 1 }}
                  >
                    {t("common.edit")}
                  </Button>
                  {can(entity, "delete") && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(r._id)}
                    >
                      {t("common.delete")}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={cfg.fields.length + 2} align="center">
                  {t("common.empty", "Aucun élément")}
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
        <DialogTitle>{t(cfg.editTitleKey ?? "common.edit")}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack gap={2}>
            {cfg.fields.map((f) =>
              renderField(f, editing?.data?.[f.name] ?? "", (v) =>
                onChangeEditField(f, v)
              )
            )}
            {!isUsers && (
              <Select
                value={editing?.status ? "true" : "false"}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, status: e.target.value === "true" } : prev
                  )
                }
              >
                <MenuItem value="true">{t("common.active")}</MenuItem>
                <MenuItem value="false">{t("common.inactive")}</MenuItem>
              </Select>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>{t("common.cancel")}</Button>
          <Button variant="contained" onClick={handleUpdate}>
            {t("common.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
