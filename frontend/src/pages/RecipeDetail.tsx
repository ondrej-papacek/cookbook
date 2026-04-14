import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Box,
    Typography,
    List,
    ListItem,
    Divider,
    Stack,
    Tooltip,
    IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getCategories, type Category } from "../api/categories";
import { getRecipe } from "../api/recipes";
import { Button } from "../components/UI/Button";
import { useShoppingListContext } from "../context/ShoppingListContext";
import { CookingMode } from "../components/CookingMode";

export function RecipeDetail() {
    const { id } = useParams();

    const [recipe, setRecipe] = useState<any>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cooking, setCooking] = useState(false);
    const wakeLockRef = useRef<any>(null);

    const { addItem, addAll, removeItem, isAdded, items } = useShoppingListContext();

    useEffect(() => {
        if (!id) return;
        getRecipe(id).then(setRecipe);
    }, [id]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const slugToName = useMemo(
        () => new Map(categories.map((c) => [c.slug, c.name] as const)),
        [categories]
    );

    const requestWakeLock = async () => {
        try {
            if ("wakeLock" in navigator && (navigator as any).wakeLock?.request) {
                wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
            }
        } catch (err) {
            console.warn("Wake Lock request failed:", err);
        }
    };

    const releaseWakeLock = async () => {
        try {
            await wakeLockRef.current?.release?.();
        } catch (err) {
            console.warn("Wake Lock release failed:", err);
        } finally {
            wakeLockRef.current = null;
        }
    };

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible" && cooking) {
                requestWakeLock().catch(() => {});
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [cooking]);

    useEffect(() => {
        return () => { releaseWakeLock(); };
    }, []);

    const handleCookingToggle = async () => {
        if (!cooking) {
            await requestWakeLock();
            setCooking(true);
        } else {
            await releaseWakeLock();
            setCooking(false);
        }
    };

    const toEmbedUrl = (url: string) => {
        try {
            if (!url) return "";
            if (url.includes("/embed/")) return url;
            if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
            if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
        } catch { }
        return url;
    };

    if (!recipe) {
        return (
            <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 4 }}>
                <Typography>Načítám...</Typography>
            </Box>
        );
    }

    if (cooking) {
        return (
            <CookingMode
                recipe={recipe}
                onExit={handleCookingToggle}
            />
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 4 }}>
            {recipe.image && (
                <img
                    src={recipe.image}
                    alt={recipe.name}
                    style={{ width: "100%", borderRadius: 8, marginBottom: "1rem" }}
                />
            )}

            <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                gap={1}
                mb={2}
            >
                <Button variant="outlined" color="primary" onClick={handleCookingToggle}>
                    Vařím
                </Button>
                <Button
                    component={Link}
                    to={`/edit/${id}`}
                    variant="outlined"
                    startIcon={<EditIcon />}
                >
                    Upravit recept
                </Button>
            </Box>

            <Typography
                variant="h3"
                gutterBottom
                fontWeight="bold"
                sx={{ fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" } }}
            >
                {recipe.name}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" mb={1}>
                Kategorie: {(recipe.categories ?? []).map((s: string) => slugToName.get(s) || s).join(", ")}
            </Typography>

            {((recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)) > 0 && (
                <Typography variant="body2" color="text.secondary" mb={3}>
                    {[
                        recipe.prepTime ? `Příprava: ${recipe.prepTime} min` : null,
                        recipe.cookTime ? `Vaření: ${recipe.cookTime} min` : null,
                        recipe.prepTime && recipe.cookTime
                            ? `Celkem: ${recipe.prepTime + recipe.cookTime} min`
                            : null,
                    ]
                        .filter(Boolean)
                        .join("  ·  ")}
                </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* ── Ingredients ── */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1,
                    mb: 1,
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    Ingredience
                </Typography>
                <Stack direction="row" gap={1} alignItems="center">
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => addAll(recipe.ingredients ?? [], id!, recipe.name)}
                    >
                        Přidat vše
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        component={Link}
                        to="/nakup"
                        sx={{ color: "text.secondary" }}
                    >
                        Zobrazit seznam →
                    </Button>
                </Stack>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
                    gap: 0.5,
                    mb: 3,
                }}
            >
                {(recipe.ingredients ?? []).map((ing: string, i: number) => {
                    const added = isAdded(ing, id!);
                    const addedItem = items.find(
                        (it) => it.ingredient === ing && it.recipeId === id
                    );
                    return (
                        <Box
                            key={i}
                            sx={{ display: "flex", alignItems: "center", gap: 0.5, lineHeight: 1.6 }}
                        >
                            <Tooltip
                                title={added ? "Odebrat ze seznamu" : "Přidat do nákupního seznamu"}
                                placement="left"
                            >
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        if (added && addedItem) {
                                            removeItem(addedItem.id);
                                        } else {
                                            addItem(ing, id!, recipe.name);
                                        }
                                    }}
                                    sx={{
                                        color: added ? "primary.main" : "text.disabled",
                                        flexShrink: 0,
                                    }}
                                >
                                    {added ? (
                                        <RemoveShoppingCartIcon fontSize="small" />
                                    ) : (
                                        <AddShoppingCartIcon fontSize="small" />
                                    )}
                                </IconButton>
                            </Tooltip>
                            <Typography component="span" sx={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
                                {ing}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* ── Steps ── */}
            <Typography variant="h5" gutterBottom fontWeight="bold">
                Postup
            </Typography>
            <List sx={{ lineHeight: 1.6 }}>
                {(recipe.steps ?? []).map((step: string, i: number) => (
                    <ListItem
                        key={i}
                        sx={{
                            pl: 0,
                            py: 0.5,
                            display: "list-item",
                            listStyleType: "decimal",
                            ml: 2,
                        }}
                    >
                        {step}
                    </ListItem>
                ))}
            </List>

            {/* ── Video ── */}
            {recipe.youtubeUrl && (
                <Box sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Video
                    </Typography>
                    <Box
                        sx={{
                            position: "relative",
                            paddingTop: "56.25%",
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >
                        <iframe
                            src={toEmbedUrl(String(recipe.youtubeUrl))}
                            title="YouTube video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                                position: "absolute",
                                top: 0, left: 0,
                                width: "100%", height: "100%",
                                border: "none",
                            }}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
}
