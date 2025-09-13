import {
    AppBar,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCategories } from "../../api/categories";
import type { Category } from "../../api/categories";
import { SearchBar } from "./SearchBar";
import { Button } from "../UI/Button";

export function Navbar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: "transparent",
                color: "white",
            }}
        >
            <Toolbar sx={{ gap: 2 }}>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    Cookbook
                </Typography>

                <Button color="inherit" component={Link} to="/">
                    Domů
                </Button>

                {/* Category Dropdown */}
                <Button color="inherit" onClick={handleOpen}>
                    Kategorie
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {categories.map((cat) => (
                        <MenuItem
                            key={cat.id}
                            component={Link}
                            to={`/categories/${cat.slug}`}
                            onClick={handleClose}
                        >
                            {cat.name}
                        </MenuItem>
                    ))}
                </Menu>

                <Button color="inherit" component={Link} to="/add">
                    Přidat recept
                </Button>

                {/* Search Bar — placed at the end */}
                <Box sx={{ ml: 2, flexGrow: 1, maxWidth: 400 }}>
                    <SearchBar />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
