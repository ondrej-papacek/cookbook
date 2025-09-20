import { useEffect, useMemo, useState } from "react";
import { Box, Container, Pagination, Typography, Stack, Divider } from "@mui/material";
import { RecipeFilter } from "../components/RecipeFilter";
import { RecipeCard } from "../components/RecipeCard";
import { useRecipes } from "../hooks/useRecipes";
import { getCategories, type Category } from "../api/categories";
import { Button } from "../components/UI/Button";

type Filters = {
    mealType: string[];
    diet: string[];
    season: string[];
};

const PER_PAGE = 12;

export function AllRecipes() {
    const { recipes, loading } = useRecipes();
    const [categories, setCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState<Filters>({
        mealType: [],
        diet: [],
        season: [],
    });
    const [page, setPage] = useState(1);
    const [randomRecipe, setRandomRecipe] = useState<any | null>(null);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const slugToName = useMemo(() => {
        const map = new Map<string, string>();
        categories.forEach((c) => map.set(c.slug, c.name));
        return map;
    }, [categories]);

    const filtered = useMemo(() => {
        let out = recipes;

        const mustContainAny = (candidate: string[]) => (r: string[] = []) =>
            r.some((s) => candidate.includes(s));

        if (filters.mealType.length > 0) {
            out = out.filter((r) => mustContainAny(filters.mealType)(r.categories));
        }
        if (filters.diet.length > 0) {
            out = out.filter((r) => mustContainAny(filters.diet)(r.categories));
        }
        if (filters.season.length > 0) {
            out = out.filter((r) => mustContainAny(filters.season)(r.categories));
        }

        return out;
    }, [recipes, filters]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const start = (page - 1) * PER_PAGE;
    const current = filtered.slice(start, start + PER_PAGE);

    const handleFilterChange = (section: keyof Filters, value: string) => {
        setPage(1);
        setFilters((prev) => {
            const exists = prev[section].includes(value);
            return {
                ...prev,
                [section]: exists
                    ? prev[section].filter((v) => v !== value)
                    : [...prev[section], value],
            };
        });
    };

    const handleRandomRecipe = () => {
        if (filtered.length === 0) {
            setRandomRecipe(null);
            return;
        }

        let random;
        do {
            random = filtered[Math.floor(Math.random() * filtered.length)];
        } while (filtered.length > 1 && random.id === randomRecipe?.id);

        setRandomRecipe(random);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) return <p>Načítám...</p>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3 }}
            >
                <Typography variant="h4">Všechny recepty</Typography>
                <Button variant="contained" onClick={handleRandomRecipe}>
                    Navrhni recept
                </Button>
            </Stack>

            {randomRecipe && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Tip na dnešní vaření:
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <RecipeCard
                            id={randomRecipe.id}
                            name={randomRecipe.name}
                            categories={(randomRecipe.categories ?? []).map(
                                (s: string) => slugToName.get(s) || s
                            )}
                            image={randomRecipe.image}
                        />
                    </Box>
                    <Divider sx={{ my: 3 }} />
                </Box>
            )}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                }}
            >
                <Box sx={{ flex: { xs: "1 1 auto", md: "0 0 280px" } }}>
                    <RecipeFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {current.map((r) => (
                            <RecipeCard
                                key={r.id}
                                id={r.id}
                                name={r.name}
                                categories={(r.categories ?? []).map(
                                    (s) => slugToName.get(s) || s
                                )}
                                image={r.image}
                            />
                        ))}
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <Pagination
                            color="primary"
                            count={pageCount}
                            page={page}
                            onChange={(_, p) => setPage(p)}
                        />
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
