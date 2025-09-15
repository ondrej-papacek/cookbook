import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: { main: "#401f0a" },
        secondary: { main: "#8d6e63" },
        background: { default: "#fafaf6", paper: "#ffffff" },
    },
    typography: {
        fontFamily: "Poppins, Arial, sans-serif",
    },
});

export default theme;
