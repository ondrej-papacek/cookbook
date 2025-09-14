import { useEffect, useState } from "react";
import { AppBar, Toolbar, Box, Collapse } from "@mui/material";
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
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    color: "white",
                }}
            >
                <Toolbar sx={{ gap: 2 }}>
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "inherit",
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

                    <Button color="inherit" component={Link} to="/">
                        Domů
                    </Button>

                    <Button
                        color="inherit"
                        onClick={() => setCatsOpen((o) => !o)}
                    >
                        Kategorie
                    </Button>

                    <Button color="inherit" component={Link} to="/recepty">
                        Všechny recepty
                    </Button>
                    <Button color="inherit" component={Link} to="/add">
                        Přidat recept
                    </Button>

                    <Box sx={{ ml: 2, flexGrow: 1, maxWidth: 400 }}>
                        <SearchBar />
                    </Box>
                </Toolbar>
            </AppBar>

            <Collapse in={catsOpen} unmountOnExit>
                <CategoryNavbar onItemClick={() => setCatsOpen(false)} />
            </Collapse>
        </>
    );
}
