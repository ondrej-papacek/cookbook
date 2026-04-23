import { Box, Typography, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { ESPRESSO } from "../../theme";

const NAV_LINKS = [
    { to: "/", label: "Domů" },
    { to: "/recepty", label: "Všechny recepty" },
    { to: "/plan", label: "Jídelníček" },
];

export function Footer() {
    return (
        <Box sx={{ bgcolor: ESPRESSO, py: { xs: 4, md: 5 }, color: "white" }}>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: { xs: "center", md: "flex-start" },
                        justifyContent: "space-between",
                        gap: 3,
                        textAlign: { xs: "center", md: "left" },
                    }}
                >
                    {/* Brand */}
                    <Box>
                        <Box
                            component="img"
                            src="/logo-cookbook.png"
                            alt="Cookbook logo"
                            sx={{
                                height: 44,
                                borderRadius: 1,
                                mb: 1.5,
                                display: "block",
                                mx: { xs: "auto", md: 0 },
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{ color: "rgba(255,255,255,0.55)" }}
                        >
                            © {new Date().getFullYear()} Naše kuchařka
                        </Typography>
                    </Box>

                    {/* Nav links */}
                    <Stack
                        direction={{ xs: "row", md: "column" }}
                        spacing={{ xs: 3, md: 1 }}
                        flexWrap="wrap"
                        justifyContent="center"
                    >
                        {NAV_LINKS.map(({ to, label }) => (
                            <Typography
                                key={to}
                                component={Link}
                                to={to}
                                sx={{
                                    color: "rgba(255,255,255,0.65)",
                                    textDecoration: "none",
                                    fontSize: "0.875rem",
                                    transition: "color 0.2s",
                                    "&:hover": { color: "white" },
                                }}
                            >
                                {label}
                            </Typography>
                        ))}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
