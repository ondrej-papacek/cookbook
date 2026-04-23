import { createTheme } from "@mui/material/styles";

export const PARCHMENT = "#f5e6d3";
export const ESPRESSO = "#2a1205";

const theme = createTheme({
    palette: {
        primary: { main: "#401f0a" },
        secondary: { main: "#8d6e63" },
        background: { default: "#fafaf6", paper: "#ffffff" },
    },
    typography: {
        fontFamily: "Poppins, Arial, sans-serif",
        h1: { fontFamily: "'Playfair Display', Georgia, serif" },
        h2: { fontFamily: "'Playfair Display', Georgia, serif" },
        h3: { fontFamily: "'Playfair Display', Georgia, serif" },
        h4: { fontFamily: "'Playfair Display', Georgia, serif" },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: "0 2px 12px rgba(64,31,10,0.08)",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    textTransform: "none" as const,
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                },
            },
            variants: [
                {
                    props: { variant: "contained", color: "primary" },
                    style: {
                        background: "linear-gradient(135deg, #401f0a 0%, #6b3a1f 100%)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #5a2c10 0%, #7e4525 100%)",
                        },
                    },
                },
            ],
        },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 8, fontWeight: 500 },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 10,
                        transition: "box-shadow 0.2s",
                    },
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    height: 8,
                    "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #401f0a, #8d6e63)",
                        borderRadius: 8,
                    },
                },
            },
        },
    },
});

export default theme;
