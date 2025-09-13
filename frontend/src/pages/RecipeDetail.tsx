import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, List, ListItem } from "@mui/material";
import axios from "axios";
import { getCategories, type Category } from "../api/categories";

const API_URL = import.meta.env.VITE_API_URL;

export function RecipeDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<any>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        axios
            .get(`${API_URL}/api/recipes/${id}`)
            .then((res) => setRecipe(res.data));
    }, [id]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    if (!recipe) return <p>Načítám...</p>;

    const categoryName =
        categories.find((c) => c.slug === recipe.category)?.name ||
        recipe.category;

    return (
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
            {recipe.image && (
                <img
                    src={recipe.image}
                    alt={recipe.name}
                    style={{ width: "100%", borderRadius: 8 }}
                />
            )}
            <Typography variant="h3" gutterBottom>
                {recipe.name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom color="text.secondary">
                Kategorie: {categoryName}
            </Typography>

            <Typography variant="h5">Ingredience</Typography>
            <List>
                {recipe.ingredients.map((ing: string, i: number) => (
                    <ListItem key={i}>{ing}</ListItem>
                ))}
            </List>

            <Typography variant="h5" sx={{ mt: 2 }}>
                Postup
            </Typography>
            <List>
                {recipe.steps.map((step: string, i: number) => (
                    <ListItem key={i}>{step}</ListItem>
                ))}
            </List>
        </Box>
    );
}
