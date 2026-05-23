import { Box, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { ESPRESSO } from "../../theme";

type FooterLink = { to: string; label: string };
type FooterSection = { heading: string; links: FooterLink[] };

const FOOTER_SECTIONS: FooterSection[] = [
    {
        heading: "Recepty",
        links: [
            { to: "/", label: "Domů" },
            { to: "/recepty", label: "Všechny recepty" },
            { to: "/categories", label: "Kategorie" },
            { to: "/add", label: "Přidat recept" },
        ],
    },
    {
        heading: "Plánování",
        links: [
            { to: "/plan", label: "Jídelníčky" },
            { to: "/nakup", label: "Nákupní seznam" },
        ],
    },
];

export function Footer() {
    return (
        <Box
            component="footer"
            sx={{ bgcolor: ESPRESSO, py: { xs: 5, md: 6 }, color: "white" }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "1.4fr repeat(2, 1fr)",
                        },
                        gap: { xs: 4, md: 6 },
                        textAlign: { xs: "center", sm: "left" },
                    }}
                >
                    {/* Brand */}
                    <Box>
                        <Box
                            component="img"
                            src="/new-logo.jpeg"
                            alt="Cookbook logo"
                            sx={{
                                height: 44,
                                borderRadius: 1,
                                mb: 1.5,
                                display: "block",
                                mx: { xs: "auto", sm: 0 },
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: "rgba(255,255,255,0.65)",
                                maxWidth: 280,
                                mx: { xs: "auto", sm: 0 },
                            }}
                        >
                            Naše rodinná kuchařka — recepty, jídelníček a nákupní seznam na jednom místě.
                        </Typography>
                    </Box>

                    {/* Sitemap */}
                    {FOOTER_SECTIONS.map((section) => (
                        <Box
                            key={section.heading}
                            component="nav"
                            aria-label={section.heading}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 700,
                                    mb: 1.5,
                                    color: "white",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.6,
                                    fontSize: "0.8rem",
                                }}
                            >
                                {section.heading}
                            </Typography>
                            <Box
                                component="ul"
                                sx={{
                                    listStyle: "none",
                                    p: 0,
                                    m: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0.75,
                                }}
                            >
                                {section.links.map(({ to, label }) => (
                                    <li key={to}>
                                        <Typography
                                            component={Link}
                                            to={to}
                                            sx={{
                                                color: "rgba(255,255,255,0.7)",
                                                textDecoration: "none",
                                                fontSize: "0.875rem",
                                                transition: "color 0.2s",
                                                "&:hover": { color: "white" },
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                    </li>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Box
                    sx={{
                        mt: { xs: 4, md: 5 },
                        pt: 3,
                        borderTop: "1px solid rgba(255,255,255,0.12)",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}
                    >
                        © {new Date().getFullYear()} Naše kuchařka
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}