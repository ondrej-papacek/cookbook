import { useMemo, useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { RecipeCard } from "../components/RecipeCard";
import { Link } from "react-router-dom";
import { useRecipes } from "../hooks/useRecipes";
import { getCategories, type Category } from "../api/categories";

export function Home() {
    const { recipes, loading } = useRecipes();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const slugToName = useMemo(() => {
        const map = new Map<string, string>();
        categories.forEach((c) => map.set(c.slug, c.name));
        return map;
    }, [categories]);

    const random = useMemo(() => {
        const arr = [...recipes];
        arr.sort(() => 0.5 - Math.random());
        return arr.slice(0, 8);
    }, [recipes]);

    if (loading) return <p>Načítám...</p>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h4">Recepty pro dnešní den</Typography>
                <Button variant="contained" component={Link} to="/recepty">
                    Zobrazit všechny
                </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {random.map((r) => (
                    <RecipeCard
                        key={r.id}
                        id={r.id}
                        name={r.name}
                        category={(r.categories ?? [])
                            .map((s) => slugToName.get(s) || s)
                            .join(", ")}
                        image={r.image}
                    />
                ))}
            </Box>
        </Container>
    );
}
