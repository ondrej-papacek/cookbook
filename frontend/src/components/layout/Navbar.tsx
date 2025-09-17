import { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    Collapse,
    Container,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { Button } from "../UI/Button";
import { CategoryNavbar } from "./CategoryNavbar";

export function Navbar() {
    const [catsOpen, setCatsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setCatsOpen(false);
    }, [location.pathname]);

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    color: "#401f0a",
                    zIndex: (theme) => theme.zIndex.appBar + 1,
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar sx={{ gap: 2 }}>
                        <Box
                            component={Link}
                            to="/"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                textDecoration: "none",
                                color: "#401f0a",
                            }}
                        >
                            <img
                                src="/logo-cookbook.png"
                                alt="Cookbook logo"
                                style={{
                                    height: "50px",
                                    marginRight: "8px",
                                    borderRadius: "8px",
                                }}
                            />
                        </Box>

                        <Button
                            color="inherit"
                            component={Link}
                            to="/"
                            sx={{ color: "#401f0a" }}
                        >
                            Domů
                        </Button>

                        <Button
                            color="inherit"
                            onClick={() => setCatsOpen((o) => !o)}
                            sx={{ color: "#401f0a" }}
                        >
                            Kategorie
                        </Button>

                        <Button
                            color="inherit"
                            component={Link}
                            to="/recepty"
                            sx={{ color: "#401f0a" }}
                        >
                            Všechny recepty
                        </Button>

                        <Button
                            color="inherit"
                            component={Link}
                            to="/add"
                            sx={{ color: "#401f0a" }}
                        >
                            Přidat recept
                        </Button>

                        <Box sx={{ ml: 2, flexGrow: 1, maxWidth: 400 }}>
                            <SearchBar />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Collapse in={catsOpen} unmountOnExit>
                <CategoryNavbar onItemClick={() => setCatsOpen(false)} />
            </Collapse>
        </>
    );
}
