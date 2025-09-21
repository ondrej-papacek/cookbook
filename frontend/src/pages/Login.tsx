import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/"); // po loginu zpět na homepage
        } catch {
            setError("Neplatný email nebo heslo.");
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Box component="form" onSubmit={handleSubmit} sx={{ width: 300 }}>
                <Typography variant="h5" mb={2}>Přihlášení</Typography>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Heslo"
                    type="password"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Přihlásit se
                </Button>
            </Box>
        </Box>
    );
}
