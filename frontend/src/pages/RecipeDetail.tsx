import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Box,
    Typography,
    List,
    ListItem,
    Divider,
    Stack,
    TextField,
    Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import { getCategories, type Category } from "../api/categories";
import { getRecipe } from "../api/recipes";
import { Button } from "../components/UI/Button";

export function RecipeDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<any>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    // Cooking mode
    const [cooking, setCooking] = useState(false);
    const wakeLockRef = useRef<any>(null);

    // Timer
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [running, setRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        if (!id) return;
        getRecipe(id).then(setRecipe);
    }, [id]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const slugToName = useMemo(
        () => new Map(categories.map((c) => [c.slug, c.name])),
        [categories]
    );

    if (!recipe) return <p>Načítám...</p>;

    const categoryNames = (recipe.categories ?? []).map(
        (s: string) => slugToName.get(s) || s
    );

    // --- Wake Lock ---
    const requestWakeLock = async () => {
        try {
            if ("wakeLock" in navigator && (navigator as any).wakeLock.request) {
                wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
            }
        } catch (err) {
            console.warn("Wake Lock API not available:", err);
        }
    };

    const releaseWakeLock = async () => {
        try {
            await wakeLockRef.current?.release();
            wakeLockRef.current = null;
        } catch (err) {
            console.warn("Failed to release wake lock:", err);
        }
    };

    // Restore wake lock if tab becomes visible again
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible" && cooking) {
                requestWakeLock().catch((err) =>
                    console.warn("Wake lock re-request failed:", err)
                );
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [cooking]);

    // --- Timer ---
    const handleStart = async () => {
        const total = hours * 3600 + minutes * 60 + seconds;
        if (total <= 0) return;

        setRemaining(total);
        setRunning(true);

        timerRef.current = setInterval(() => {
            setRemaining((prev) => {
                if (prev !== null && prev > 1) {
                    return prev - 1;
                } else {
                    clearInterval(timerRef.current!);
                    setRunning(false);

                    // Snackbar
                    setSnackbarOpen(true);

                    // Vibrace (Android)
                    if (navigator.vibrate) {
                        navigator.vibrate([300, 150, 300]);
                    }

                    return 0;
                }
            });
        }, 1000);
    };

    const handleStop = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setRunning(false);
        setRemaining(null);
    };

    const formatTime = (total: number) => {
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // --- Cooking toggle ---
    const handleCookingToggle = async () => {
        if (!cooking) {
            await requestWakeLock();
            setCooking(true);
        } else {
            await releaseWakeLock();
            setCooking(false);
            handleStop();
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 4 }}>
            {recipe.image && (
                <img
                    src={recipe.image}
                    alt={recipe.name}
                    style={{
                        width: "100%",
                        borderRadius: 8,
                        marginBottom: "1rem",
                    }}
                />
            )}

            <Box display="flex" justifyContent="space-between" mb={2}>
                <Button
                    variant={cooking ? "contained" : "outlined"}
                    color={cooking ? "secondary" : "primary"}
                    onClick={handleCookingToggle}
                >
                    {cooking ? "Hotovo!" : "Vařím"}
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

            {cooking && (
                <Box
                    sx={{
                        p: 2,
                        mb: 3,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Časovač
                    </Typography>
                    {!running ? (
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <TextField
                                type="number"
                                label="Hodiny"
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}
                                slotProps={{ input: { inputProps: { min: 0 } } }}
                            />

                            <TextField
                                type="number"
                                label="Minuty"
                                value={minutes}
                                onChange={(e) => setMinutes(Number(e.target.value))}
                                slotProps={{ input: { inputProps: { min: 0, max: 59 } } }}
                            />

                            <TextField
                                type="number"
                                label="Sekundy"
                                value={seconds}
                                onChange={(e) => setSeconds(Number(e.target.value))}
                                slotProps={{ input: { inputProps: { min: 0, max: 59 } } }}
                            />
                        </Stack>
                    ) : (
                        <Typography variant="h4" align="center" gutterBottom>
                            {remaining !== null ? formatTime(remaining) : ""}
                        </Typography>
                    )}

                    <Stack direction="row" spacing={2}>
                        {!running ? (
                            <Button variant="contained" onClick={handleStart}>
                                Start
                            </Button>
                        ) : (
                            <Button variant="outlined" onClick={handleStop}>
                                Stop
                            </Button>
                        )}
                    </Stack>
                </Box>
            )}

            <Typography variant="h3" gutterBottom fontWeight="bold">
                {recipe.name}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" mb={3}>
                Kategorie: {categoryNames.join(", ")}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" gutterBottom fontWeight="bold">
                Ingredience
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 1,
                    mb: 3,
                }}
            >
                {(recipe.ingredients ?? []).map((ing: string, i: number) => (
                    <Box
                        key={i}
                        component="li"
                        sx={{
                            listStyleType: "disc",
                            ml: 3,
                            lineHeight: 1.6,
                        }}
                    >
                        {ing}
                    </Box>
                ))}
            </Box>

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
                            src={recipe.youtubeUrl.replace("watch?v=", "embed/")}
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

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity="success"
                    onClose={() => setSnackbarOpen(false)}
                >
                    Čas vypršel – Hotovo!
                </MuiAlert>
            </Snackbar>
        </Box>
    );
}
