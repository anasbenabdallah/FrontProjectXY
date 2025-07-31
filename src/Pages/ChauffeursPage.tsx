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

interface Chauffeur {
  _id?: string;
  nom: string;
  prenom: string;
  permis: string;
  status?: string;
}

export default function ChauffeursPage() {
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
  const [form, setForm] = useState<Chauffeur>({
    nom: "",
    prenom: "",
    permis: "",
    status: "active",
  });
  const [editingChauffeur, setEditingChauffeur] = useState<Chauffeur | null>(
    null
  );

  const fetchChauffeurs = async () => {
    const res = await api.get("/chauffeurs");
    setChauffeurs(res.data);
  };
  useEffect(() => {
    fetchChauffeurs();
  }, []);

  const handleAdd = async () => {
    await api.post("/chauffeurs", form);
    setForm({ nom: "", prenom: "", permis: "", status: "active" });
    fetchChauffeurs();
  };
  const handleDelete = async (id?: string) => {
    if (!id) return;
    await api.delete(`/chauffeurs/${id}`);
    fetchChauffeurs();
  };
  const handleEditSave = async () => {
    if (!editingChauffeur?._id) return;
    await api.put(`/chauffeurs/${editingChauffeur._id}`, editingChauffeur);
    setEditingChauffeur(null);
    fetchChauffeurs();
  };

  return (
    <div>
      <h3>Gestion des Chauffeurs</h3>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Nom"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          sx={{ mr: 1 }}
        />
        <TextField
          label="Prénom"
          value={form.prenom}
          onChange={(e) => setForm({ ...form, prenom: e.target.value })}
          sx={{ mr: 1 }}
        />
        <TextField
          label="Permis"
          value={form.permis}
          onChange={(e) => setForm({ ...form, permis: e.target.value })}
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
              <TableCell>Prénom</TableCell>
              <TableCell>Permis</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chauffeurs.map((c) => (
              <TableRow key={c._id}>
                <TableCell>{c.nom}</TableCell>
                <TableCell>{c.prenom}</TableCell>
                <TableCell>{c.permis}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>
                  <Button onClick={() => setEditingChauffeur(c)} sx={{ mr: 1 }}>
                    Modifier
                  </Button>
                  <Button color="error" onClick={() => handleDelete(c._id)}>
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal édition */}
      <Dialog
        open={!!editingChauffeur}
        onClose={() => setEditingChauffeur(null)}
      >
        <DialogTitle>Modifier Chauffeur</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            value={editingChauffeur?.nom || ""}
            onChange={(e) =>
              setEditingChauffeur({ ...editingChauffeur!, nom: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Prénom"
            value={editingChauffeur?.prenom || ""}
            onChange={(e) =>
              setEditingChauffeur({
                ...editingChauffeur!,
                prenom: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Permis"
            value={editingChauffeur?.permis || ""}
            onChange={(e) =>
              setEditingChauffeur({
                ...editingChauffeur!,
                permis: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
          <Select
            value={editingChauffeur?.status || "active"}
            onChange={(e) =>
              setEditingChauffeur({
                ...editingChauffeur!,
                status: e.target.value,
              })
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
          <Button onClick={() => setEditingChauffeur(null)}>Annuler</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
