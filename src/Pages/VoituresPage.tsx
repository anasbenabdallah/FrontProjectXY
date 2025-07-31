import { useEffect, useState } from "react";
import api from "../api/api";
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
} from "@mui/material";

interface Voiture {
  _id?: string;
  marque: string;
  modele: string;
  immatriculation: string;
  status?: string;
}

export default function VoituresPage() {
  const [voitures, setVoitures] = useState<Voiture[]>([]);
  const [form, setForm] = useState<Voiture>({
    marque: "",
    modele: "",
    immatriculation: "",
    status: "active",
  });
  const [editingVoiture, setEditingVoiture] = useState<Voiture | null>(null);

  const fetchVoitures = async () => {
    const res = await api.get("/voitures");
    setVoitures(res.data);
  };
  useEffect(() => {
    fetchVoitures();
  }, []);

  const handleAdd = async () => {
    await api.post("/voitures", form);
    setForm({ marque: "", modele: "", immatriculation: "", status: "active" });
    fetchVoitures();
  };
  const handleDelete = async (id?: string) => {
    if (!id) return;
    await api.delete(`/voitures/${id}`);
    fetchVoitures();
  };
  const handleEditSave = async () => {
    if (!editingVoiture?._id) return;
    await api.put(`/voitures/${editingVoiture._id}`, editingVoiture);
    setEditingVoiture(null);
    fetchVoitures();
  };

  return (
    <div>
      <h3>Gestion des Voitures</h3>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Marque"
          value={form.marque}
          onChange={(e) => setForm({ ...form, marque: e.target.value })}
          sx={{ mr: 1 }}
        />
        <TextField
          label="Modèle"
          value={form.modele}
          onChange={(e) => setForm({ ...form, modele: e.target.value })}
          sx={{ mr: 1 }}
        />
        <TextField
          label="Immatriculation"
          value={form.immatriculation}
          onChange={(e) =>
            setForm({ ...form, immatriculation: e.target.value })
          }
          sx={{ mr: 1 }}
        />
        <Select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          sx={{ mr: 1, minWidth: 120 }}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="suspended">Suspendue</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleAdd}>
          Ajouter
        </Button>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Marque</TableCell>
              <TableCell>Modèle</TableCell>
              <TableCell>Immatriculation</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {voitures.map((v) => (
              <TableRow key={v._id}>
                <TableCell>{v.marque}</TableCell>
                <TableCell>{v.modele}</TableCell>
                <TableCell>{v.immatriculation}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell>
                  <Button onClick={() => setEditingVoiture(v)} sx={{ mr: 1 }}>
                    Modifier
                  </Button>
                  <Button color="error" onClick={() => handleDelete(v._id)}>
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal édition */}
      <Dialog open={!!editingVoiture} onClose={() => setEditingVoiture(null)}>
        <DialogTitle>Modifier Voiture</DialogTitle>
        <DialogContent>
          <TextField
            label="Marque"
            value={editingVoiture?.marque || ""}
            onChange={(e) =>
              setEditingVoiture({ ...editingVoiture!, marque: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Modèle"
            value={editingVoiture?.modele || ""}
            onChange={(e) =>
              setEditingVoiture({ ...editingVoiture!, modele: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Immatriculation"
            value={editingVoiture?.immatriculation || ""}
            onChange={(e) =>
              setEditingVoiture({
                ...editingVoiture!,
                immatriculation: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
          <Select
            value={editingVoiture?.status || "active"}
            onChange={(e) =>
              setEditingVoiture({ ...editingVoiture!, status: e.target.value })
            }
            fullWidth
            margin="dense"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="suspended">Suspendue</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingVoiture(null)}>Annuler</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
