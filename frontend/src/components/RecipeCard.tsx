import { useState } from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    IconButton,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { Button } from "./UI/Button";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export type RecipeCardProps = {
    id: string;
    name: string;
    category: string;
    image?: string;
    onDeleted?: () => void;
};

export function RecipeCard({ id, name, category, image, onDeleted }: RecipeCardProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/api/recipes/${id}`);
            setOpen(false);
            if (onDeleted) onDeleted();
        } catch (err) {
            console.error("Failed to delete recipe", err);
        }
    };

    return (
        <>
            <Card
                sx={{
                    position: "relative",
                    maxWidth: 300,
                    "&:hover .actions": { opacity: 1 }, // 👈 key change
                }}
            >
                {/* Recipe image */}
                {image && <CardMedia component="img" height="180" image={image} alt={name} />}

                {/* Content */}
                <CardContent>
                    <Typography variant="h6" gutterBottom>{name}</Typography>
                    <Typography variant="body2" color="text.secondary">{category}</Typography>
                </CardContent>

                {/* Hover icons */}
                <Box
                    className="actions"
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        display: "flex",
                        gap: 1,
                        opacity: 0,
                        transition: "opacity 0.3s",
                    }}
                >
                    {/* Edit */}
                    <IconButton component={Link} to={`/edit/${id}`} size="small" sx={{ bgcolor: "white" }}>
                        <EditIcon fontSize="small" />
                    </IconButton>

                    {/* Delete */}
                    <IconButton size="small" sx={{ bgcolor: "white" }} onClick={() => setOpen(true)}>
                        <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                </Box>
            </Card>

            {/* Delete confirmation dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Smazat recept?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Opravdu chcete smazat recept <strong>{name}</strong>? Tuto akci
                        nelze vrátit zpět.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="inherit">
                        Zrušit
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Smazat
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
