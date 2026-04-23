import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Box,
    Typography,
    Divider,
    Stack,
    Tooltip,
    IconButton,
    Chip,
    Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getCategories, type Category } from "../api/categories";
import { getRecipe } from "../api/recipes";
import { Button } from "../components/UI/Button";
import { useShoppingListContext } from "../context/ShoppingListContext";
import { CookingMode } from "../components/CookingMode";
import { RevealOnScroll } from "../components/UI/RevealOnScroll";
import { motion, useScroll, useTransform } from "framer-motion";
import { PARCHMENT } from "../theme";

export function RecipeDetail() {
    const { id } = useParams();

    const [recipe, setRecipe] = useState<any>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cooking, setCooking] = useState(false);
    const wakeLockRef = useRef<any>(null);

    const { addItem, addAll, removeItem, isAdded, items } = useShoppingListContext();

    const { scrollY } = useScroll();
    const imageY = useTransform(scrollY, [0, 400], [0, 80]);

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

    // ── Loading skeleton ──
    if (!recipe) {
        return (
            <Box sx={{ maxWidth: 800, mx: "auto" }}>
                <Skeleton
                    variant="rectangular"
                    sx={{
                        mx: { xs: -2, sm: -3 },
                        height: { xs: 260, sm: 360, md: 440 },
                    }}
                />
                <Box sx={{ px: 2, pt: 3 }}>
                    <Skeleton variant="text" width="60%" height={56} />
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <Skeleton variant="rounded" width={80} height={24} />
                        <Skeleton variant="rounded" width={110} height={24} />
                    </Box>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 1,
                            mt: 4,
                        }}
                    >
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} variant="text" />
                        ))}
                    </Box>
                    <Skeleton variant="text" width="25%" height={36} sx={{ mt: 4 }} />
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} variant="text" sx={{ mt: 1.5, height: 28 }} />
                    ))}
                </Box>
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

    const prepTime: number = recipe.prepTime ?? 0;
    const cookTime: number = recipe.cookTime ?? 0;

    return (
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
            {/* ── Hero image with parallax ── */}
            {recipe.image && (
                <Box
                    sx={{
                        mx: { xs: -2, sm: -3 },
                        position: "relative",
                        overflow: "hidden",
                        height: { xs: 260, sm: 360, md: 440 },
                    }}
                >
                    <motion.div
                        style={{
                            y: imageY,
                            position: "absolute",
                            top: "-10%",
                            left: 0,
                            right: 0,
                            bottom: "-10%",
                        }}
                    >
                        <img
                            src={recipe.image}
                            alt={recipe.name}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                            }}
                        />
                    </motion.div>
                    {/* Fade into page background */}
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(to top, #fafaf6 2%, transparent 55%)",
                            pointerEvents: "none",
                        }}
                    />
                </Box>
            )}

            <Box sx={{ px: 2, pt: recipe.image ? 2 : 4, pb: 4 }}>
                {/* ── Action buttons ── */}
                <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    gap={1}
                    mb={2.5}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCookingToggle}
                        sx={{
                            "@keyframes pulseGlow": {
                                "0%, 100%": { boxShadow: "0 0 0 0 rgba(64,31,10,0.4)" },
                                "50%": { boxShadow: "0 0 0 12px rgba(64,31,10,0)" },
                            },
                            animation: "pulseGlow 2.5s ease-in-out infinite",
                        }}
                    >
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

                {/* ── Recipe title (Playfair via theme h3) ── */}
                <Typography
                    variant="h3"
                    gutterBottom
                    fontWeight="bold"
                    sx={{ fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" } }}
                >
                    {recipe.name}
                </Typography>

                {/* ── Meta chips ── */}
                <Stack direction="row" flexWrap="wrap" gap={1} mb={3}>
                    {(recipe.categories ?? []).map((s: string) => (
                        <Chip
                            key={s}
                            label={slugToName.get(s) || s}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    ))}
                    {prepTime > 0 && (
                        <Chip
                            icon={<AccessTimeIcon />}
                            label={`Příprava: ${prepTime} min`}
                            size="small"
                            variant="outlined"
                        />
                    )}
                    {cookTime > 0 && (
                        <Chip
                            icon={<AccessTimeIcon />}
                            label={`Vaření: ${cookTime} min`}
                            size="small"
                            variant="outlined"
                        />
                    )}
                    {prepTime > 0 && cookTime > 0 && (
                        <Chip
                            label={`Celkem: ${prepTime + cookTime} min`}
                            size="small"
                            sx={{ bgcolor: PARCHMENT, fontWeight: 600 }}
                        />
                    )}
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* ── Ingredients — parchment section ── */}
                <Box
                    sx={{
                        bgcolor: PARCHMENT,
                        borderRadius: 3,
                        p: { xs: 2, sm: 3 },
                        mb: 4,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 2,
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
                        }}
                    >
                        {(recipe.ingredients ?? []).map((ing: string, i: number) => {
                            const added = isAdded(ing, id!);
                            const addedItem = items.find(
                                (it) => it.ingredient === ing && it.recipeId === id
                            );
                            return (
                                <RevealOnScroll key={i} delay={i * 0.03}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            lineHeight: 1.6,
                                        }}
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
                                        <Typography
                                            component="span"
                                            sx={{ fontSize: "0.95rem", lineHeight: 1.6 }}
                                        >
                                            {ing}
                                        </Typography>
                                    </Box>
                                </RevealOnScroll>
                            );
                        })}
                    </Box>
                </Box>

                {/* ── Steps with decorative numbers ── */}
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                    Postup
                </Typography>

                <Box sx={{ mb: 4 }}>
                    {(recipe.steps ?? []).map((step: string, i: number) => (
                        <RevealOnScroll key={i} delay={i * 0.06}>
                            <Box
                                sx={{
                                    position: "relative",
                                    mb: 4,
                                    pl: { xs: 5, sm: 6 },
                                    minHeight: 48,
                                }}
                            >
                                {/* Decorative step number */}
                                <Typography
                                    sx={{
                                        position: "absolute",
                                        left: -8,
                                        top: -14,
                                        fontFamily: "'Playfair Display', Georgia, serif",
                                        fontSize: { xs: "3.5rem", sm: "4.5rem" },
                                        fontWeight: 700,
                                        lineHeight: 1,
                                        color: "#401f0a",
                                        opacity: 0.1,
                                        userSelect: "none",
                                        pointerEvents: "none",
                                    }}
                                >
                                    {i + 1}
                                </Typography>
                                <Typography sx={{ fontSize: "1rem", lineHeight: 1.85 }}>
                                    {step}
                                </Typography>
                            </Box>
                        </RevealOnScroll>
                    ))}
                </Box>

                {/* ── Video ── */}
                {recipe.youtubeUrl && (
                    <Box sx={{ mt: 2, maxWidth: 600, mx: "auto" }}>
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
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
