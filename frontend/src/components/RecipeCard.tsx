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
import { deleteRecipe } from "../api/recipes";

export type RecipeCardProps = {
    id: string;
    name: string;
    categories: string[];
    image?: string;
    onDeleted?: () => void;
};

export function RecipeCard({ id, name, categories, image, onDeleted }: RecipeCardProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteRecipe(id);
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
                    "&:hover .actions": { opacity: 1 },
                }}
            >
                <Box
                    component={Link}
                    to={`/recipes/${id}`}
                    sx={{ textDecoration: "none", color: "inherit" }}
                >
                    {image && (
                        <CardMedia component="img" height="180" image={image} alt={name} />
                    )}

                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {categories.join(", ")}
                        </Typography>
                    </CardContent>
                </Box>

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
                    <IconButton
                        component={Link}
                        to={`/edit/${id}`}
                        size="small"
                        sx={{ bgcolor: "white" }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                        size="small"
                        sx={{ bgcolor: "white" }}
                        onClick={() => setOpen(true)}
                    >
                        <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                </Box>
            </Card>

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
