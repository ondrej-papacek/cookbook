import { useMemo, useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { RecipeCard } from "../components/RecipeCard";
import { RevealOnScroll } from "../components/UI/RevealOnScroll";
import { RecipeGridSkeleton } from "../components/UI/RecipeGridSkeleton";
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

    if (loading) return <RecipeGridSkeleton count={8} />;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <RevealOnScroll>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
                    >
                        Recepty pro dnešní den
                    </Typography>
                    <Button variant="contained" component={Link} to="/recepty">
                        Zobrazit všechny
                    </Button>
                </Box>
            </RevealOnScroll>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                    gap: 2,
                }}
            >
                {random.map((r, i) => (
                    <RevealOnScroll key={r.id} delay={i * 0.05}>
                        <RecipeCard
                            id={r.id}
                            name={r.name}
                            categories={(r.categories ?? []).map(
                                (s) => slugToName.get(s) || s
                            )}
                            image={r.image}
                            totalTime={(r.prepTime ?? 0) + (r.cookTime ?? 0) || undefined}
                        />
                    </RevealOnScroll>
                ))}
            </Box>
        </Container>
    );
}
