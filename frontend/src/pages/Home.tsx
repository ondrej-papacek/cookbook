import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { RecipeFilter } from "../components/RecipeFilter";
import { RecipeCard } from "../components/RecipeCard";
import { getRecipes } from "../api/recipes";

export function Home() {
    const [filters, setFilters] = useState({
        mealType: [] as string[],
        diet: [] as string[],
        season: [] as string[],
        ingredient: [] as string[],
    });
    const [recipes, setRecipes] = useState<any[]>([]);

    useEffect(() => {
        getRecipes().then(setRecipes);
    }, []);

    const handleFilterChange = (section: keyof typeof filters, value: string) => {
        setFilters((prev) => {
            const alreadySelected = prev[section].includes(value);
            return {
                ...prev,
                [section]: alreadySelected
                    ? prev[section].filter((v) => v !== value)
                    : [...prev[section], value],
            };
        });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                }}
            >
                {/* Sidebar */}
                <Box sx={{ flex: { xs: "1 1 auto", md: "0 0 280px" } }}>
                    <RecipeFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </Box>

                {/* Main content */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    {recipes.map((r) => (
                        <RecipeCard
                            key={r.id}
                            id={r.id}
                            name={r.name}
                            category={r.category}
                            image={r.image}
                        />
                    ))}
                </Box>
            </Box>
        </Container>
    );
}
