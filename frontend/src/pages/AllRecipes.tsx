import { useEffect, useMemo, useState } from "react";
import { Box, Container, Pagination, Typography } from "@mui/material";
import { RecipeFilter } from "../components/RecipeFilter";
import { RecipeCard } from "../components/RecipeCard";
import { useRecipes } from "../hooks/useRecipes";
import { getCategories, type Category } from "../api/categories";

type Filters = {
    mealType: string[];
};

const PER_PAGE = 12;

export function AllRecipes() {
    const { recipes, loading } = useRecipes();
    const [categories, setCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState<Filters>({ mealType: [] });
    const [page, setPage] = useState(1);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    // Map category name <-> slug
    const nameToSlug = useMemo(() => {
        const map = new Map<string, string>();
        categories.forEach((c) => map.set(c.name, c.slug));
        return map;
    }, [categories]);

    const slugToName = useMemo(() => {
        const map = new Map<string, string>();
        categories.forEach((c) => map.set(c.slug, c.name));
        return map;
    }, [categories]);

    // Apply filters
    const filtered = useMemo(() => {
        let out = recipes;

        if (filters.mealType.length > 0) {
            const wantedSlugs = filters.mealType
                .map((n) => nameToSlug.get(n))
                .filter(Boolean);
            out = out.filter((r) => wantedSlugs.includes(r.category));
        }

        return out;
    }, [recipes, filters, nameToSlug]);

    // Pagination
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

    if (loading) return <p>Načítám...</p>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Všechny recepty
            </Typography>

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

                {/* List */}
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {current.map((r) => (
                            <RecipeCard
                                key={r.id}
                                id={r.id}
                                name={r.name}
                                category={slugToName.get(r.category) || r.category}
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
