import { useMemo, useState } from "react";
import {
    Avatar,
    Box,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Link } from "react-router-dom";
import { useMealPlan, type MealSlot } from "../hooks/useMealPlan";
import { useRecipes } from "../hooks/useRecipes";
import { useShoppingListContext } from "../context/ShoppingListContext";
import { Button } from "../components/UI/Button";

// ── Date helpers ──────────────────────────────────────────────
const DAYS_CS = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];

function localDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function getWeekDays(): string[] {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return localDateStr(d);
    });
}

function formatDayHeader(dateStr: string) {
    const [y, m, day] = dateStr.split("-").map(Number);
    const d = new Date(y, m - 1, day);
    return `${DAYS_CS[d.getDay()]} ${d.getDate()}. ${d.getMonth() + 1}.`;
}

function isToday(dateStr: string) {
    return dateStr === localDateStr(new Date());
}

// ── Slot label ────────────────────────────────────────────────
const SLOT_LABELS: Record<MealSlot, string> = { obed: "Oběd", vecere: "Večeře" };
const SLOTS: MealSlot[] = ["obed", "vecere"];

// ── Meal slot card ────────────────────────────────────────────
function SlotCell({
    slot,
    onAdd,
    meal,
    onRemove,
}: {
    slot: MealSlot;
    onAdd: () => void;
    meal: ReturnType<ReturnType<typeof useMealPlan>["getMeal"]>;
    onRemove: (id: string) => void;
}) {
    return (
        <Box>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5, fontWeight: 600 }}
            >
                {SLOT_LABELS[slot]}
            </Typography>

            {meal ? (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        minHeight: 52,
                    }}
                >
                    {meal.recipeImage && (
                        <Avatar
                            src={meal.recipeImage}
                            variant="rounded"
                            sx={{ width: 36, height: 36, flexShrink: 0 }}
                        />
                    )}
                    <Typography
                        component={Link}
                        to={`/recipes/${meal.recipeId}`}
                        variant="body2"
                        sx={{
                            flex: 1,
                            textDecoration: "none",
                            color: "text.primary",
                            lineHeight: 1.3,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {meal.recipeName}
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => onRemove(meal.id)}
                        sx={{ flexShrink: 0, color: "text.disabled", "&:hover": { color: "error.main" } }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            ) : (
                <Box
                    onClick={onAdd}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 1,
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 2,
                        minHeight: 52,
                        cursor: "pointer",
                        color: "text.disabled",
                        "&:hover": { borderColor: "primary.main", color: "primary.main" },
                        transition: "all 0.15s",
                    }}
                >
                    <AddIcon fontSize="small" />
                </Box>
            )}
        </Box>
    );
}

// ── Recipe picker dialog ──────────────────────────────────────
function RecipePicker({
    open,
    onClose,
    onSelect,
}: {
    open: boolean;
    onClose: () => void;
    onSelect: (recipe: { id: string; name: string; image?: string }) => void;
}) {
    const { recipes } = useRecipes();
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return q
            ? recipes.filter((r) => r.name.toLowerCase().includes(q))
            : recipes;
    }, [recipes, search]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Vybrat recept
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 0 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Hledat..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 1 }}
                />
                <List dense disablePadding sx={{ maxHeight: "50vh", overflow: "auto" }}>
                    {filtered.map((r) => (
                        <ListItemButton
                            key={r.id}
                            onClick={() => {
                                onSelect({ id: r.id, name: r.name, image: r.image });
                                setSearch("");
                                onClose();
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar src={r.image} variant="rounded" sx={{ width: 36, height: 36 }} />
                            </ListItemAvatar>
                            <ListItemText primary={r.name} />
                        </ListItemButton>
                    ))}
                    {filtered.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                            Žádné recepty nenalezeny.
                        </Typography>
                    )}
                </List>
            </DialogContent>
        </Dialog>
    );
}

// ── Main page ─────────────────────────────────────────────────
export function MealPlan() {
    const weekDays = useMemo(() => getWeekDays(), []);
    const { getMeal, addMeal, removeMeal } = useMealPlan();
    const { recipes } = useRecipes();
    const { addAll } = useShoppingListContext();

    const [pickerSlot, setPickerSlot] = useState<{ date: string; slot: MealSlot } | null>(null);

    const openPicker = (date: string, slot: MealSlot) => setPickerSlot({ date, slot });

    const handleSelect = (recipe: { id: string; name: string; image?: string }) => {
        if (!pickerSlot) return;
        addMeal(pickerSlot.date, pickerSlot.slot, recipe);
        setPickerSlot(null);
    };

    const plannedCount = weekDays.reduce(
        (acc, date) => acc + SLOTS.filter((s) => getMeal(date, s) !== null).length,
        0
    );

    const handleAddAllToShopping = () => {
        weekDays.forEach((date) => {
            SLOTS.forEach((slot) => {
                const meal = getMeal(date, slot);
                if (!meal) return;
                const recipe = recipes.find((r) => r.id === meal.recipeId);
                if (recipe && recipe.ingredients.length > 0) {
                    addAll(recipe.ingredients, meal.recipeId, meal.recipeName);
                }
            });
        });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarMonthIcon color="primary" />
                    <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}>
                        Jídelníček
                    </Typography>
                </Box>

                {plannedCount > 0 && (
                    <Button
                        variant="outlined"
                        startIcon={<ShoppingCartIcon />}
                        component={Link}
                        to="/nakup"
                        onClick={handleAddAllToShopping}
                    >
                        Přidat vše do nákupu
                    </Button>
                )}
            </Box>

            {/* Desktop: 7-column grid / Mobile: vertical list */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(4, 1fr)",
                        lg: "repeat(7, 1fr)",
                    },
                    gap: 2,
                }}
            >
                {weekDays.map((date) => (
                    <Box
                        key={date}
                        sx={{
                            p: 1.5,
                            border: 1,
                            borderColor: isToday(date) ? "primary.main" : "divider",
                            borderRadius: 2,
                            bgcolor: isToday(date) ? "rgba(64, 31, 10, 0.06)" : "background.paper",
                        }}
                    >
                        {/* Day header */}
                        <Typography
                            variant="subtitle2"
                            fontWeight={isToday(date) ? 700 : 500}
                            color={isToday(date) ? "primary.main" : "text.primary"}
                            mb={1.5}
                        >
                            {formatDayHeader(date)}
                            {isToday(date) && (
                                <Typography
                                    component="span"
                                    variant="caption"
                                    sx={{ ml: 0.75, color: "primary.main" }}
                                >
                                    (dnes)
                                </Typography>
                            )}
                        </Typography>

                        <Stack spacing={1.5}>
                            {SLOTS.map((slot) => (
                                <SlotCell
                                    key={slot}
                                    slot={slot}
                                    meal={getMeal(date, slot)}
                                    onAdd={() => openPicker(date, slot)}
                                    onRemove={removeMeal}
                                />
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Box>

            <RecipePicker
                open={pickerSlot !== null}
                onClose={() => setPickerSlot(null)}
                onSelect={handleSelect}
            />
        </Container>
    );
}
