import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Container,
    Drawer,
    IconButton,
    Pagination,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import { RecipeFilter } from "../components/RecipeFilter";
import { RecipeCard } from "../components/RecipeCard";
import { RevealOnScroll } from "../components/UI/RevealOnScroll";
import { RecipeGridSkeleton } from "../components/UI/RecipeGridSkeleton";
import { useRecipes } from "../hooks/useRecipes";
import { getCategories, type Category } from "../api/categories";
import { Button } from "../components/UI/Button";

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
    const [filterOpen, setFilterOpen] = useState(false);
    const [timeLimit, setTimeLimit] = useState<number | null>(null);

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
            if (filters.mealType.length > 0 && !cats.some((c) => filters.mealType.includes(c))) return false;
            if (filters.diet.length > 0 && !cats.some((c) => filters.diet.includes(c))) return false;
            if (filters.season.length > 0 && !cats.some((c) => filters.season.includes(c))) return false;
            if (timeLimit !== null) {
                const total = (r.prepTime ?? 0) + (r.cookTime ?? 0);
                if (total > 0 && total > timeLimit) return false;
            }
            return true;
        });
    }, [inCategory, filters, timeLimit]);

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

    if (loading) return <RecipeGridSkeleton count={12} />;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    mb: 3,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
                >
                    Recepty v kategorii: {title}
                </Typography>

                <Button
                    variant="outlined"
                    onClick={() => setFilterOpen(true)}
                    startIcon={<TuneIcon />}
                    sx={{ display: { xs: "flex", md: "none" } }}
                >
                    Filtrovat
                </Button>
            </Box>

            {/* Mobile filter drawer */}
            <Drawer
                anchor="left"
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                sx={{ "& .MuiDrawer-paper": { width: { xs: "85vw", sm: 320 } } }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1.5,
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    <Typography variant="h6" sx={{ pl: 1 }}>
                        Filtrovat recepty
                    </Typography>
                    <IconButton onClick={() => setFilterOpen(false)} aria-label="Zavřít filtry">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <RecipeFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    timeLimit={timeLimit}
                    onTimeLimitChange={setTimeLimit}
                />
            </Drawer>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                }}
            >
                {/* Desktop sidebar filter */}
                <Box sx={{ display: { xs: "none", md: "block" }, flex: "0 0 260px" }}>
                    <RecipeFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        timeLimit={timeLimit}
                        onTimeLimitChange={setTimeLimit}
                    />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
                            },
                            gap: 2,
                        }}
                    >
                        {current.map((r, i) => (
                            <RevealOnScroll key={r.id} delay={i * 0.04}>
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

                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <Pagination
                            color="primary"
                            count={pageCount}
                            page={page}
                            onChange={(_, p) => setPage(p)}
                            size="small"
                        />
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
