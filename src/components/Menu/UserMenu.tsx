import { useState, useEffect } from "react";
import { Avatar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../../src/api/api";

export default function UserMenu() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState<string>("");

  // 🔹 Récupération dynamique du nom
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserName(res.data.nom);
      } catch (error) {
        console.error("Erreur récupération utilisateur", error);
      }
    };
    fetchUser();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
        <Avatar>{userName ? userName.charAt(0).toUpperCase() : "?"}</Avatar>
        <Typography variant="body1" sx={{ ml: 1, color: "white" }}>
          {userName || "Chargement..."}
        </Typography>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleLogout();
          }}
        >
          Déconnexion
        </MenuItem>
      </Menu>
    </>
  );
}
