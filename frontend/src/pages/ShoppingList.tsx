import {
    Box,
    Checkbox,
    Container,
    Divider,
    IconButton,
    Typography,
    Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import { useShoppingListContext } from "../context/ShoppingListContext";
import { Button } from "../components/UI/Button";

export function ShoppingList() {
    const { items, removeItem, toggleChecked, clearChecked, clearAll } =
        useShoppingListContext();

    // Group items by recipe
    const groups = items.reduce<Record<string, typeof items>>((acc, item) => {
        if (!acc[item.recipeId]) acc[item.recipeId] = [];
        acc[item.recipeId].push(item);
        return acc;
    }, {});

    const checkedCount = items.filter((i) => i.checked).length;

    if (items.length === 0) {
        return (
            <Container maxWidth="sm" sx={{ py: 6, textAlign: "center" }}>
                <ShoppingCartIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Nákupní seznam je prázdný
                </Typography>
                <Typography color="text.secondary" mb={3}>
                    Přidej ingredience z receptů a uvidíš je tady.
                </Typography>
                <Button variant="contained" component={Link} to="/recepty">
                    Procházet recepty
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    mb: 3,
                }}
            >
                <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}>
                    Nákupní seznam
                </Typography>

                <Stack direction="row" gap={1}>
                    {checkedCount > 0 && (
                        <Button variant="outlined" size="small" onClick={clearChecked}>
                            Vymazat nakoupené ({checkedCount})
                        </Button>
                    )}
                    <Button variant="outlined" size="small" color="error" onClick={clearAll}>
                        Vymazat vše
                    </Button>
                </Stack>
            </Box>

            {Object.entries(groups).map(([recipeId, groupItems]) => {
                const recipeName = groupItems[0].recipeName;
                return (
                    <Box key={recipeId} sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 0.5,
                            }}
                        >
                            <Typography
                                variant="overline"
                                color="text.secondary"
                                sx={{ letterSpacing: 1 }}
                            >
                                {recipeName}
                            </Typography>
                            <Button
                                component={Link}
                                to={`/recipes/${recipeId}`}
                                size="small"
                                variant="text"
                                sx={{ fontSize: "0.75rem" }}
                            >
                                Recept →
                            </Button>
                        </Box>

                        <Divider sx={{ mb: 1 }} />

                        {groupItems.map((item) => (
                            <Box
                                key={item.id}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    py: 0.25,
                                    opacity: item.checked ? 0.45 : 1,
                                    transition: "opacity 0.2s",
                                }}
                            >
                                <Checkbox
                                    checked={item.checked}
                                    onChange={() => toggleChecked(item.id)}
                                    size="small"
                                    sx={{ color: "primary.main" }}
                                />
                                <Typography
                                    sx={{
                                        flex: 1,
                                        textDecoration: item.checked ? "line-through" : "none",
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    {item.ingredient}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => removeItem(item.id)}
                                    aria-label="Odebrat"
                                    sx={{ color: "text.disabled", "&:hover": { color: "error.main" } }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                );
            })}
        </Container>
    );
}
