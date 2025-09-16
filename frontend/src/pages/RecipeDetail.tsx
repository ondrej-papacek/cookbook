import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, List, ListItem } from "@mui/material";
import { getCategories, type Category } from "../api/categories";
import { getRecipe } from "../api/recipes";

export function RecipeDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<any>(null);
    const [categories, setCategories] = useState<Category[]>([]);

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
                Kategorie: {categoryNames.join(", ")}
            </Typography>

            <Typography variant="h5">Ingredience</Typography>
            <List>
                {(recipe.ingredients ?? []).map((ing: string, i: number) => (
                    <ListItem key={i}>{ing}</ListItem>
                ))}
            </List>

            <Typography variant="h5" sx={{ mt: 2 }}>
                Postup
            </Typography>
            <List>
                {(recipe.steps ?? []).map((step: string, i: number) => (
                    <ListItem key={i}>{step}</ListItem>
                ))}
            </List>
        </Box>
    );
}
