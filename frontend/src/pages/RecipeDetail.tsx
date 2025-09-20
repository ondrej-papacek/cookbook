import { useEffect, useMemo, useRef, useState } from "react";
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

    const [cooking, setCooking] = useState(false);
    const wakeLockRef = useRef<any>(null);

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [running, setRunning] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);

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
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            releaseWakeLock();
        };
    }, []);

    const startTimer = () => {
        const total = hours * 3600 + minutes * 60 + seconds;
        if (total <= 0) return;

        setRemaining(total);
        setRunning(true);

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setRemaining((prev) => {
                if (prev === null) return null;
                if (prev > 1) return prev - 1;

                if (timerRef.current) clearInterval(timerRef.current);
                setRunning(false);
                setSnackbarOpen(true);
                if (navigator.vibrate) {
                    navigator.vibrate([300, 150, 300]);
                }
                return 0;
            });
        }, 1000);
    };

    const stopTimer = () => {
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

    const handleCookingToggle = async () => {
        if (!cooking) {
            await requestWakeLock();
            setCooking(true);
        } else {
            await releaseWakeLock();
            setCooking(false);
            stopTimer();
        }
    };

    const toEmbedUrl = (url: string) => {
        try {
            if (!url) return "";
            if (url.includes("/embed/")) return url;
            if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
            if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
        } catch {
        }
        return url;
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 4 }}>
            {!recipe ? (
                <Typography>Načítám...</Typography>
            ) : (
                <>
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
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Časovač
                            </Typography>

                            {!running ? (
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
                                    <TextField
                                        type="number"
                                        label="Hodiny"
                                        value={hours}
                                        onChange={(e) => setHours(Math.max(0, Number(e.target.value ?? 0)))}
                                        slotProps={{ input: { inputProps: { min: 0, inputMode: "numeric" } } }}
                                    />
                                    <TextField
                                        type="number"
                                        label="Minuty"
                                        value={minutes}
                                        onChange={(e) =>
                                            setMinutes(Math.min(59, Math.max(0, Number(e.target.value ?? 0))))
                                        }
                                        slotProps={{ input: { inputProps: { min: 0, max: 59, inputMode: "numeric" } } }}
                                    />
                                    <TextField
                                        type="number"
                                        label="Sekundy"
                                        value={seconds}
                                        onChange={(e) =>
                                            setSeconds(Math.min(59, Math.max(0, Number(e.target.value ?? 0))))
                                        }
                                        slotProps={{ input: { inputProps: { min: 0, max: 59, inputMode: "numeric" } } }}
                                    />
                                </Stack>
                            ) : (
                                <Typography
                                    variant="h4"
                                    align="center"
                                    gutterBottom
                                    color={remaining !== null && remaining <= 10 ? "error.main" : "text.primary"}
                                >
                                    {remaining !== null ? formatTime(remaining) : ""}
                                </Typography>
                            )}

                            <Stack direction="row" spacing={2}>
                                {!running ? (
                                    <Button variant="contained" onClick={startTimer}>
                                        Start
                                    </Button>
                                ) : (
                                    <Button variant="outlined" onClick={stopTimer}>
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
                        Kategorie: {(recipe.categories ?? []).map((s: string) => slugToName.get(s) || s).join(", ")}
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
                                sx={{ listStyleType: "disc", ml: 3, lineHeight: 1.6 }}
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
                </>
            )}
        </Box>
    );
}
