import { useState } from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    IconButton,
    Box,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./UI/Button";
import { deleteRecipe } from "../api/recipes";

export type RecipeCardProps = {
    id: string;
    name: string;
    categories: string[];
    image?: string;
    totalTime?: number;
    onDeleted?: () => void;
};

const isTouchDevice =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

export function RecipeCard({ id, name, categories, image, totalTime, onDeleted }: RecipeCardProps) {
    const [hovered, setHovered] = useState(false);
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

    const actionsVisible = isTouchDevice || hovered;

    return (
        <>
            <motion.div
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{ width: "100%", display: "block" }}
            >
                <Card sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
                    <Box
                        component={Link}
                        to={`/recipes/${id}`}
                        sx={{ textDecoration: "none", color: "inherit", display: "block" }}
                    >
                        {image && (
                            <Box sx={{ position: "relative", overflow: "hidden", height: 200 }}>
                                <motion.div
                                    animate={{ scale: hovered ? 1.06 : 1 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    style={{ height: 200, transformOrigin: "center center" }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={image}
                                        alt={name}
                                        sx={{ height: 200, objectFit: "cover", display: "block" }}
                                    />
                                </motion.div>

                                {/* Permanent gradient overlay — keeps text readable */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        background:
                                            "linear-gradient(to top, rgba(42,18,5,0.52) 0%, transparent 55%)",
                                        pointerEvents: "none",
                                    }}
                                />

                                {/* Time badge on image */}
                                {totalTime != null && totalTime > 0 && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 8,
                                            left: 8,
                                            bgcolor: "rgba(42,18,5,0.72)",
                                            color: "white",
                                            px: 1,
                                            py: 0.3,
                                            borderRadius: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                        }}
                                    >
                                        <AccessTimeIcon sx={{ fontSize: 12 }} />
                                        <Typography
                                            variant="caption"
                                            sx={{ fontWeight: 600, lineHeight: 1 }}
                                        >
                                            {totalTime} min
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}

                        <CardContent>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontWeight: 600,
                                    lineHeight: 1.3,
                                    fontSize: "1rem",
                                    mb: 1,
                                }}
                            >
                                {name}
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {categories.slice(0, 3).map((cat, i) => (
                                    <Chip
                                        key={i}
                                        label={cat}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: "0.68rem", height: 22 }}
                                    />
                                ))}
                            </Box>
                        </CardContent>
                    </Box>

                    {/* Action buttons — slide in from right on hover */}
                    <motion.div
                        animate={{
                            x: actionsVisible ? 0 : 12,
                            opacity: actionsVisible ? 1 : 0,
                        }}
                        initial={{ x: isTouchDevice ? 0 : 12, opacity: isTouchDevice ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            display: "flex",
                            gap: 6,
                        }}
                    >
                        <IconButton
                            component={Link}
                            to={`/edit/${id}`}
                            size="small"
                            sx={{ bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)" }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{ bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)" }}
                            onClick={(e) => {
                                e.preventDefault();
                                setOpen(true);
                            }}
                        >
                            <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                    </motion.div>
                </Card>
            </motion.div>

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
