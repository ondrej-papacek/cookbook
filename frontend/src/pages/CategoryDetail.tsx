import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { getRecipes } from "../api/recipes";
import { getCategories, type Category } from "../api/categories";
import { RecipeCard } from "../components/RecipeCard";

export function CategoryDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [recipes, setRecipes] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (!slug) return;
        getRecipes().then((all) => {
            setRecipes(all.filter((r: any) => r.category === slug));
        });
    }, [slug]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const categoryName =
        categories.find((c) => c.slug === slug)?.name || slug;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Recepty v kategorii: {categoryName}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {recipes.map((r) => (
                    <RecipeCard
                        key={r.id}
                        id={r.id}
                        name={r.name}
                        category={
                            categories.find((c) => c.slug === r.category)?.name ||
                            r.category
                        }
                        image={r.image}
                    />
                ))}
            </Box>
        </Box>
    );
}
