import { Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("fr") ? "fr" : "en";

  return (
    <Select
      size="small"
      value={lang}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      sx={{ ml: 2, color: "white", ".MuiSvgIcon-root": { color: "white" } }}
    >
      <MenuItem value="fr">FR</MenuItem>
      <MenuItem value="en">EN</MenuItem>
    </Select>
  );
}
