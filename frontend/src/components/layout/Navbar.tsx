import { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    Collapse,
    Container,
    Button as MuiButton,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Divider as MuiDivider,
    Badge,
    Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useShoppingListContext } from "../../context/ShoppingListContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { Button } from "../UI/Button";
import { CategoryNavbar } from "./CategoryNavbar";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

export function Navbar() {
    const [catsOpen, setCatsOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
    const { uncheckedCount } = useShoppingListContext();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setCatsOpen(false);
        setDrawerOpen(false);
        setMobileCatsOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    return (
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
                <Toolbar sx={{ gap: 1 }}>
                    {/* Logo */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "#401f0a",
                            flexShrink: 0,
                        }}
                    >
                        <Box
                            component="img"
                            src="/logo-cookbook.png"
                            alt="Cookbook logo"
                            sx={{
                                height: { xs: 36, sm: 44, md: 50 },
                                mr: 1,
                                borderRadius: "8px",
                            }}
                        />
                    </Box>

                    {/* Desktop nav buttons */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>
                        <Button color="inherit" component={Link} to="/" sx={{ color: "#401f0a" }}>
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
                    </Box>

                    {/* Spacer */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Desktop search */}
                    <Box sx={{ display: { xs: "none", md: "block" }, width: 320 }}>
                        <SearchBar />
                    </Box>

                    {/* Desktop shopping cart */}
                    <Tooltip title="Nákupní seznam">
                        <IconButton
                            component={Link}
                            to="/nakup"
                            sx={{ display: { xs: "none", md: "flex" }, color: "#401f0a" }}
                        >
                            <Badge badgeContent={uncheckedCount || null} color="primary">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {/* Desktop logout */}
                    <MuiButton
                        color="inherit"
                        onClick={handleLogout}
                        sx={{ display: { xs: "none", md: "flex" }, color: "#401f0a" }}
                    >
                        Odhlásit se
                    </MuiButton>

                    {/* Mobile hamburger */}
                    <IconButton
                        onClick={() => setDrawerOpen(true)}
                        sx={{ display: { xs: "flex", md: "none" }, color: "#401f0a" }}
                        aria-label="Otevřít menu"
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>

                {/* Desktop categories collapse */}
                <Collapse in={catsOpen} unmountOnExit>
                    <CategoryNavbar onItemClick={() => setCatsOpen(false)} />
                </Collapse>
            </Container>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{ "& .MuiDrawer-paper": { width: { xs: "85vw", sm: 320 } } }}
            >
                <Box
                    sx={{
                        p: 1.5,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <IconButton onClick={() => setDrawerOpen(false)} aria-label="Zavřít menu">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ px: 2, pb: 2 }}>
                    <SearchBar />
                </Box>

                <MuiDivider />

                <List disablePadding>
                    <ListItemButton component={Link} to="/">
                        <ListItemText primary="Domů" />
                    </ListItemButton>

                    <ListItemButton onClick={() => setMobileCatsOpen((o) => !o)}>
                        <ListItemText primary="Kategorie" />
                    </ListItemButton>

                    <Collapse in={mobileCatsOpen} unmountOnExit>
                        <CategoryNavbar
                            onItemClick={() => setDrawerOpen(false)}
                            mobile
                        />
                    </Collapse>

                    <ListItemButton component={Link} to="/recepty">
                        <ListItemText primary="Všechny recepty" />
                    </ListItemButton>

                    <ListItemButton component={Link} to="/add">
                        <ListItemText primary="Přidat recept" />
                    </ListItemButton>

                    <ListItemButton component={Link} to="/nakup">
                        <ListItemText primary="Nákupní seznam" />
                        {uncheckedCount > 0 && (
                            <Badge badgeContent={uncheckedCount} color="primary" sx={{ mr: 1 }} />
                        )}
                    </ListItemButton>
                </List>

                <MuiDivider />

                <Box sx={{ p: 2 }}>
                    <MuiButton
                        fullWidth
                        variant="outlined"
                        onClick={handleLogout}
                        sx={{ color: "#401f0a", borderColor: "#401f0a" }}
                    >
                        Odhlásit se
                    </MuiButton>
                </Box>
            </Drawer>
        </AppBar>
    );
}
