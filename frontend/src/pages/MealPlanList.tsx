import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useNavigate } from "react-router-dom";
import { RevealOnScroll } from "../components/UI/RevealOnScroll";
import { Button } from "../components/UI/Button";
import {
    useMealPlans,
    thisWeekRange,
    nextWeekRange,
    defaultPlanName,
    formatRangeLabel,
    type MealPlan,
    type MealPlanInput,
} from "../hooks/useMealPlan";
import { migrateLegacyMealPlan } from "../utils/migrateLegacyMealPlan";

function mealsLabel(n: number): string {
    if (n === 1) return "1 jídlo";
    if (n >= 2 && n <= 4) return `${n} jídla`;
    return `${n} jídel`;
}

function CreatePlanDialog({
    open,
    onClose,
    onCreate,
}: {
    open: boolean;
    onClose: () => void;
    onCreate: (input: MealPlanInput) => Promise<void>;
}) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [name, setName] = useState("");
    const [nameEdited, setNameEdited] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        const r = thisWeekRange();
        setStartDate(r.startDate);
        setEndDate(r.endDate);
        setName(defaultPlanName(r.startDate, r.endDate));
        setNameEdited(false);
        setSubmitting(false);
    }, [open]);

    const applyRange = (s: string, e: string) => {
        setStartDate(s);
        setEndDate(e);
        if (!nameEdited) setName(defaultPlanName(s, e));
    };

    const valid =
        !!startDate && !!endDate && endDate >= startDate && name.trim().length > 0;

    const submit = async () => {
        if (!valid || submitting) return;
        setSubmitting(true);
        try {
            await onCreate({ name: name.trim(), startDate, endDate, meals: [] });
        } catch {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Nový jídelníček</DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                    Vyberte období
                </Typography>
                <Stack direction="row" gap={1} sx={{ mb: 2 }} flexWrap="wrap">
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                            const r = thisWeekRange();
                            applyRange(r.startDate, r.endDate);
                        }}
                    >
                        Tento týden
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                            const r = nextWeekRange();
                            applyRange(r.startDate, r.endDate);
                        }}
                    >
                        Příští týden
                    </Button>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="Od"
                        value={startDate}
                        onChange={(e) => applyRange(e.target.value, endDate)}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="Do"
                        value={endDate}
                        onChange={(e) => applyRange(startDate, e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </Stack>

                <TextField
                    fullWidth
                    size="small"
                    label="Název"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setNameEdited(true);
                    }}
                    error={name.trim().length === 0}
                />

                {!!startDate && !!endDate && endDate < startDate && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                        Datum „Do“ musí být po datu „Od“.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Zrušit
                </Button>
                <Button variant="contained" onClick={submit} disabled={!valid || submitting}>
                    Vytvořit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export function MealPlanList() {
    const { plans, loading, error, create, remove, refresh } = useMealPlans();
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [toDelete, setToDelete] = useState<MealPlan | null>(null);

    useEffect(() => {
        migrateLegacyMealPlan(create).then((migrated) => {
            if (migrated) refresh();
        });
    }, [create, refresh]);

    const sorted = useMemo(
        () => [...plans].sort((a, b) => b.startDate.localeCompare(a.startDate)),
        [plans]
    );

    const handleCreate = async (input: MealPlanInput) => {
        const created = await create(input);
        setDialogOpen(false);
        navigate(`/plan/${created.id}`);
    };

    const confirmDelete = async () => {
        if (!toDelete) return;
        await remove(toDelete.id);
        setToDelete(null);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
                        Jídelníčky
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
                    Nový jídelníček
                </Button>
            </Box>

            {loading ? (
                <Typography color="text.secondary">Načítám…</Typography>
            ) : error ? (
                <Typography color="error">Jídelníčky se nepodařilo načíst.</Typography>
            ) : sorted.length === 0 ? (
                <Box
                    sx={{
                        textAlign: "center",
                        py: 8,
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 2,
                    }}
                >
                    <RestaurantMenuIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                        Zatím žádné jídelníčky
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Vytvořte si plán jídel na tento týden nebo libovolné období.
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
                        Nový jídelníček
                    </Button>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {sorted.map((plan, i) => (
                        <RevealOnScroll key={plan.id} delay={i * 0.05}>
                            <Box
                                onClick={() => navigate(`/plan/${plan.id}`)}
                                sx={{
                                    p: 2,
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    bgcolor: "background.paper",
                                    cursor: "pointer",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    transition: "border-color 0.15s, box-shadow 0.15s",
                                    "&:hover": {
                                        borderColor: "primary.main",
                                        boxShadow: 2,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        gap: 1,
                                    }}
                                >
                                    <Typography variant="h6" sx={{ lineHeight: 1.25 }}>
                                        {plan.name}
                                    </Typography>
                                    <Tooltip title="Smazat">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setToDelete(plan);
                                            }}
                                            sx={{
                                                flexShrink: 0,
                                                color: "text.disabled",
                                                "&:hover": { color: "error.main" },
                                            }}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={0.5}
                                    sx={{ color: "text.secondary", mt: 0.5 }}
                                >
                                    <CalendarMonthIcon sx={{ fontSize: 16 }} />
                                    <Typography variant="body2">
                                        {formatRangeLabel(plan.startDate, plan.endDate)}
                                    </Typography>
                                </Stack>

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                                    {mealsLabel(plan.meals.length)} naplánováno
                                </Typography>

                                <Box sx={{ flex: 1 }} />
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/plan/${plan.id}`);
                                        }}
                                    >
                                        Otevřít
                                    </Button>
                                </Box>
                            </Box>
                        </RevealOnScroll>
                    ))}
                </Box>
            )}

            <CreatePlanDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onCreate={handleCreate}
            />

            <Dialog open={toDelete !== null} onClose={() => setToDelete(null)} maxWidth="xs">
                <DialogTitle>Smazat jídelníček?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Opravdu chcete smazat „{toDelete?.name}“? Tuto akci nelze vrátit zpět.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setToDelete(null)} color="inherit">
                        Zrušit
                    </Button>
                    <Button variant="contained" color="error" onClick={confirmDelete}>
                        Smazat
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
