import { useEffect, useRef, useState } from "react";
import {
    Box,
    Typography,
    LinearProgress,
    Stack,
    Chip,
    TextField,
    Collapse,
    Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./UI/Button";

type Props = {
    recipe: {
        name: string;
        steps: string[];
        ingredients: string[];
    };
    onExit: () => void;
};

export function CookingMode({ recipe, onExit }: Props) {
    const steps = recipe.steps ?? [];
    const ingredients = recipe.ingredients ?? [];

    // Step navigation
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [ingredientsOpen, setIngredientsOpen] = useState(false);
    const isLastStep = currentStep === steps.length - 1;

    // Timer
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [running, setRunning] = useState(false);
    const [showCustomTimer, setShowCustomTimer] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const runTimer = (totalSeconds: number) => {
        if (totalSeconds <= 0) return;
        if (timerRef.current) clearInterval(timerRef.current);
        setRemaining(totalSeconds);
        setRunning(true);
        timerRef.current = setInterval(() => {
            setRemaining((prev) => {
                if (prev === null) return null;
                if (prev > 1) return prev - 1;
                if (timerRef.current) clearInterval(timerRef.current);
                setRunning(false);
                setSnackbarOpen(true);
                if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
                return 0;
            });
        }, 1000);
    };

    const startTimer = () => {
        runTimer(hours * 3600 + minutes * 60 + seconds);
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
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const goNext = () => {
        if (isLastStep) {
            onExit();
        } else {
            setDirection(1);
            setCurrentStep((s) => s + 1);
        }
    };

    const goPrev = () => {
        setDirection(-1);
        setCurrentStep((s) => s - 1);
    };

    const progress = steps.length > 1
        ? (currentStep / (steps.length - 1)) * 100
        : 100;

    const stepVariants = {
        enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
        center: { opacity: 1, x: 0 },
        exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
    };

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                bgcolor: "background.default",
                zIndex: 1500,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* ── Top bar ── */}
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    flexShrink: 0,
                }}
            >
                <Button
                    variant="text"
                    size="small"
                    onClick={onExit}
                    sx={{ flexShrink: 0, color: "text.secondary" }}
                >
                    ← Skončit
                </Button>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ flex: 1, borderRadius: 3 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                    {currentStep + 1}&nbsp;/&nbsp;{steps.length}
                </Typography>
            </Box>

            {/* ── Step text with slide animation ── */}
            <Box
                sx={{
                    flex: 1,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    px: { xs: 3, sm: 5 },
                    py: 3,
                }}
            >
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ width: "100%" }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: "1.2rem", sm: "1.45rem" },
                                lineHeight: 1.8,
                                textAlign: "center",
                                width: "100%",
                            }}
                        >
                            {steps[currentStep]}
                        </Typography>
                    </motion.div>
                </AnimatePresence>
            </Box>

            {/* ── Timer section ── */}
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    borderTop: 1,
                    borderColor: "divider",
                    bgcolor: "grey.50",
                    flexShrink: 0,
                }}
            >
                {running ? (
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: "monospace",
                                color: remaining !== null && remaining <= 10
                                    ? "error.main"
                                    : "text.primary",
                                minWidth: 110,
                            }}
                        >
                            {remaining !== null ? formatTime(remaining) : ""}
                        </Typography>
                        <Button variant="outlined" size="small" onClick={stopTimer}>
                            Stop
                        </Button>
                    </Stack>
                ) : (
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                            Časovač
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                            {[5, 10, 15, 30].map((mins) => (
                                <Chip
                                    key={mins}
                                    label={`${mins} min`}
                                    onClick={() => runTimer(mins * 60)}
                                    variant="outlined"
                                    size="small"
                                    clickable
                                />
                            ))}
                            <Chip
                                label="Vlastní"
                                onClick={() => setShowCustomTimer((o) => !o)}
                                variant={showCustomTimer ? "filled" : "outlined"}
                                size="small"
                                clickable
                            />
                        </Stack>

                        <Collapse in={showCustomTimer}>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                sx={{ mt: 1.5 }}
                                alignItems={{ xs: "stretch", sm: "center" }}
                            >
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <TextField
                                        type="number"
                                        label="Hod"
                                        size="small"
                                        value={hours}
                                        onChange={(e) => setHours(Math.max(0, Number(e.target.value)))}
                                        sx={{ flex: 1 }}
                                        slotProps={{ input: { inputProps: { min: 0 } } }}
                                    />
                                    <TextField
                                        type="number"
                                        label="Min"
                                        size="small"
                                        value={minutes}
                                        onChange={(e) =>
                                            setMinutes(Math.min(59, Math.max(0, Number(e.target.value))))
                                        }
                                        sx={{ flex: 1 }}
                                        slotProps={{ input: { inputProps: { min: 0, max: 59 } } }}
                                    />
                                    <TextField
                                        type="number"
                                        label="Sek"
                                        size="small"
                                        value={seconds}
                                        onChange={(e) =>
                                            setSeconds(Math.min(59, Math.max(0, Number(e.target.value))))
                                        }
                                        sx={{ flex: 1 }}
                                        slotProps={{ input: { inputProps: { min: 0, max: 59 } } }}
                                    />
                                </Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={startTimer}
                                    sx={{ flexShrink: 0, height: 40 }}
                                >
                                    Start
                                </Button>
                            </Stack>
                        </Collapse>
                    </Box>
                )}
            </Box>

            {/* ── Ingredients toggle ── */}
            <Box sx={{ px: 2, borderTop: 1, borderColor: "divider", flexShrink: 0 }}>
                <Button
                    variant="text"
                    size="small"
                    onClick={() => setIngredientsOpen((o) => !o)}
                    sx={{ color: "text.secondary", py: 1 }}
                >
                    Ingredience {ingredientsOpen ? "▲" : "▼"}
                </Button>
                <Collapse in={ingredientsOpen}>
                    <Box
                        sx={{
                            maxHeight: 160,
                            overflow: "auto",
                            pb: 1,
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 0.25,
                        }}
                    >
                        {ingredients.map((ing, i) => (
                            <Typography key={i} variant="body2" sx={{ py: 0.25 }}>
                                • {ing}
                            </Typography>
                        ))}
                    </Box>
                </Collapse>
            </Box>

            {/* ── Navigation buttons ── */}
            <Box
                sx={{
                    px: 2,
                    pb: "max(24px, env(safe-area-inset-bottom, 24px))",
                    pt: 1.5,
                    display: "flex",
                    gap: 2,
                    flexShrink: 0,
                }}
            >
                <Button
                    fullWidth
                    variant="outlined"
                    disabled={currentStep === 0}
                    onClick={goPrev}
                    sx={{ height: 56, fontSize: "1rem" }}
                >
                    ← Předchozí
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    color={isLastStep ? "success" : "primary"}
                    onClick={goNext}
                    sx={{ height: 56, fontSize: "1rem" }}
                >
                    {isLastStep ? "✓ Hotovo!" : "Další →"}
                </Button>
            </Box>

            {/* ── Timer finished snackbar ── */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                sx={{ zIndex: 1600 }}
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
