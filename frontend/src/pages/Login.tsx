import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { TextField, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/UI/Button";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch {
            setError("Neplatný email nebo heslo.");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: "url('/hero-cookbook-1.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    bgcolor: "rgba(42,18,5,0.58)",
                },
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ position: "relative", zIndex: 1 }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        bgcolor: "rgba(255,255,255,0.11)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        borderRadius: 4,
                        p: { xs: 3, sm: 5 },
                        width: { xs: "85vw", sm: 380 },
                        maxWidth: 420,
                        boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
                    }}
                >
                    {/* Logo */}
                    <Box
                        component="img"
                        src="/new-logo.jpeg"
                        alt="Logo"
                        sx={{
                            height: 52,
                            borderRadius: 1,
                            display: "block",
                            mx: "auto",
                            mb: 2,
                        }}
                    />

                    <Typography
                        variant="h5"
                        mb={3}
                        sx={{
                            color: "white",
                            textAlign: "center",
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontWeight: 700,
                        }}
                    >
                        Přihlášení
                    </Typography>

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                bgcolor: "rgba(255,255,255,0.14)",
                                color: "white",
                                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
                                "&.Mui-focused fieldset": { borderColor: "white" },
                            },
                            "& .MuiInputLabel-root": {
                                color: "rgba(255,255,255,0.7)",
                                "&.Mui-focused": { color: "white" },
                            },
                        }}
                    />

                    <TextField
                        label="Heslo"
                        type="password"
                        fullWidth
                        sx={{
                            mt: 2,
                            "& .MuiOutlinedInput-root": {
                                bgcolor: "rgba(255,255,255,0.14)",
                                color: "white",
                                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
                                "&.Mui-focused fieldset": { borderColor: "white" },
                            },
                            "& .MuiInputLabel-root": {
                                color: "rgba(255,255,255,0.7)",
                                "&.Mui-focused": { color: "white" },
                            },
                        }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <Typography color="error" sx={{ mt: 1, fontSize: "0.875rem" }}>
                            {error}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 3,
                            py: 1.25,
                            fontSize: "1rem",
                        }}
                    >
                        Přihlásit se
                    </Button>
                </Box>
            </motion.div>
        </Box>
    );
}
