// src/components/UserMenu/UserMenu.tsx
import { useState } from "react";
import { Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UserMenu({
  initials,
  email,
}: {
  initials: string;
  email: string;
}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
        <Avatar sx={{ bgcolor: "#1976d2" }}>{initials}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem disabled>{email}</MenuItem>
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
