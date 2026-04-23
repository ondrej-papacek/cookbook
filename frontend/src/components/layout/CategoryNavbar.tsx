import {
    Box,
    Button,
    Container,
    CircularProgress,
    Stack,
    List,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories } from "../../api/categories";
import type { Category } from "../../api/categories";

type Props = {
    onItemClick?: () => void;
    mobile?: boolean;
};

export function CategoryNavbar({ onItemClick, mobile = false }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Stack direction="row" alignItems="center" gap={1} sx={{ py: 1, px: mobile ? 2 : 0 }}>
                <CircularProgress size={20} />
            </Stack>
        );
    }

    // Mobile: render as vertical list inside Drawer
    if (mobile) {
        return (
            <List disablePadding sx={{ pl: 2, bgcolor: "grey.50" }}>
                {categories.map((cat) => (
                    <ListItemButton
                        key={cat.id}
                        component={Link}
                        to={`/categories/${cat.slug}`}
                        onClick={onItemClick}
                        dense
                    >
                        <ListItemText
                            primary={cat.name}
                            slotProps={{ primary: { color: "text.secondary" } }}
                        />
                    </ListItemButton>
                ))}
                <ListItemButton
                    component={Link}
                    to="/categories"
                    onClick={onItemClick}
                    dense
                >
                    <ListItemText
                        primary="Všechny kategorie"
                        slotProps={{ primary: { color: "primary", fontWeight: 600 } }}
                    />
                </ListItemButton>
            </List>
        );
    }

    // Desktop: horizontal scrollable buttons
    return (
        <Box
            sx={{
                bgcolor: "grey.100",
                py: 1,
                borderBottom: 1,
                borderColor: "divider",
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    overflowX: { xs: "auto", md: "visible" },
                    flexWrap: { xs: "nowrap", md: "wrap" },
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                    pb: { xs: 0.5, md: 0 },
                }}
            >
                {categories.map((cat) => (
                    <Button
                        key={cat.id}
                        component={Link}
                        to={`/categories/${cat.slug}`}
                        variant="text"
                        color="inherit"
                        onClick={onItemClick}
                        sx={{ textTransform: "none", flexShrink: 0 }}
                    >
                        {cat.name}
                    </Button>
                ))}

                <Button
                    component={Link}
                    to="/categories"
                    variant="outlined"
                    size="small"
                    onClick={onItemClick}
                    sx={{ ml: { md: "auto" }, flexShrink: 0 }}
                >
                    Všechny kategorie
                </Button>
            </Container>
        </Box>
    );
}
