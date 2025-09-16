import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Pagination, Typography } from "@mui/material";
import { RecipeFilter } from "../components/RecipeFilter";
import { RecipeCard } from "../components/RecipeCard";
import { useRecipes } from "../hooks/useRecipes";
import { getCategories, type Category } from "../api/categories";

const PER_PAGE = 12;

type Filters = {
    mealType: string[];
    diet: string[];
    season: string[];
};

export function CategoryDetail() {
    const { slug } = useParams<{ slug: string }>();
    const { recipes, loading } = useRecipes();
    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = useState(1);

    const [filters, setFilters] = useState<Filters>({
        mealType: [],
        diet: [],
        season: [],
    });

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const slugToName = useMemo(() => {
        const m = new Map<string, string>();
        categories.forEach((c) => m.set(c.slug, c.name));
        return m;
    }, [categories]);

    const inCategory = useMemo(
        () => recipes.filter((r) => (r.categories ?? []).includes(slug || "")),
        [recipes, slug]
    );

    const filtered = useMemo(() => {
        return inCategory.filter((r) => {
            const cats = r.categories ?? [];
            return (
                (filters.mealType.length === 0 ||
                    cats.some((c) => filters.mealType.includes(c))) &&
                (filters.diet.length === 0 ||
                    cats.some((c) => filters.diet.includes(c))) &&
                (filters.season.length === 0 ||
                    cats.some((c) => filters.season.includes(c)))
            );
        });
    }, [inCategory, filters]);

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

    const title = slugToName.get(slug || "") || slug;

    if (loading) return <p>Načítám...</p>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Recepty v kategorii: {title}
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                }}
            >
                <Box sx={{ flex: { xs: "1 1 auto", md: "0 0 280px" } }}>
                    <RecipeFilter filters={filters} onFilterChange={handleFilterChange} />
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {current.map((r) => (
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
