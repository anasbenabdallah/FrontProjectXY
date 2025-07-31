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

interface Utilisateur {
  _id?: string;
  nom: string;
  email: string;
  motDePasse?: string;
  status?: string;
}

export default function UtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [form, setForm] = useState<Utilisateur>({
    nom: "",
    email: "",
    motDePasse: "",
    status: "active",
  });
  const [editingUser, setEditingUser] = useState<Utilisateur | null>(null);

  const fetchUtilisateurs = async () => {
    const res = await api.get("/utilisateurs");
    setUtilisateurs(res.data);
  };
  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const handleAdd = async () => {
    await api.post("/utilisateurs", form);
    setForm({ nom: "", email: "", motDePasse: "", status: "active" });
    fetchUtilisateurs();
  };
  const handleDelete = async (id?: string) => {
    if (!id) return;
    await api.delete(`/utilisateurs/${id}`);
    fetchUtilisateurs();
  };
  const handleEditSave = async () => {
    if (!editingUser?._id) return;
    await api.put(`/utilisateurs/${editingUser._id}`, editingUser);
    setEditingUser(null);
    fetchUtilisateurs();
  };

  return (
    <div>
      <h3>Gestion des Utilisateurs</h3>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Nom"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          sx={{ mr: 1 }}
        />
        <TextField
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          sx={{ mr: 1 }}
        />
        <TextField
          label="Mot de passe"
          type="password"
          value={form.motDePasse}
          onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
          sx={{ mr: 1 }}
        />
        <Select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          sx={{ mr: 1, minWidth: 120 }}
        >
          <MenuItem value="active">Actif</MenuItem>
          <MenuItem value="inactive">Inactif</MenuItem>
          <MenuItem value="suspended">Suspendu</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleAdd}>
          Ajouter
        </Button>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {utilisateurs.map((u) => (
              <TableRow key={u._id}>
                <TableCell>{u.nom}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.status}</TableCell>
                <TableCell>
                  <Button onClick={() => setEditingUser(u)} sx={{ mr: 1 }}>
                    Modifier
                  </Button>
                  <Button color="error" onClick={() => handleDelete(u._id)}>
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal édition */}
      <Dialog open={!!editingUser} onClose={() => setEditingUser(null)}>
        <DialogTitle>Modifier Utilisateur</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            value={editingUser?.nom || ""}
            onChange={(e) =>
              setEditingUser({ ...editingUser!, nom: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            value={editingUser?.email || ""}
            onChange={(e) =>
              setEditingUser({ ...editingUser!, email: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <Select
            value={editingUser?.status || "active"}
            onChange={(e) =>
              setEditingUser({ ...editingUser!, status: e.target.value })
            }
            fullWidth
            margin="dense"
          >
            <MenuItem value="active">Actif</MenuItem>
            <MenuItem value="inactive">Inactif</MenuItem>
            <MenuItem value="suspended">Suspendu</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUser(null)}>Annuler</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
