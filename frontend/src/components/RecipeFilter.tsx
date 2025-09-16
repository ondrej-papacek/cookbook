import { Box, Typography, Divider } from "@mui/material";
import { Checkbox } from "./UI/Checkbox";
import { useEffect, useMemo, useState } from "react";
import { getCategories, type Category } from "../api/categories";

type Sections = "mealType" | "diet" | "season";

export type RecipeFilterProps = {
    filters: Record<Sections, string[]>;
    onFilterChange: (section: Sections, value: string) => void;
    hiddenSections?: Sections[];
};

const DIET_ROOT_SLUGS = ["dieta", "diet", "diets"];
const SEASON_ROOT_SLUGS = ["sezona", "sezóna", "season", "seasons"];

export function RecipeFilter({
                                 filters,
                                 onFilterChange,
                                 hiddenSections = [],
                             }: RecipeFilterProps) {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const isHidden = (s: Sections) => hiddenSections.includes(s);

    const roots = useMemo(
        () => categories.filter((c) => !c.parentId),
        [categories]
    );
    const childrenOf = (parentId: string) =>
        categories.filter((c) => c.parentId === parentId);

    const dietRoot = roots.find((r) => DIET_ROOT_SLUGS.includes(r.slug));
    const seasonRoot = roots.find((r) => SEASON_ROOT_SLUGS.includes(r.slug));
    const mealRoots = roots.filter(
        (r) => r.id !== dietRoot?.id && r.id !== seasonRoot?.id
    );

    return (
        <Box sx={{ p: 2, width: 250 }}>
            <Typography variant="h6" gutterBottom>
                Filtrovat recepty
            </Typography>

            {/* Jídla = všechny kořeny kromě dieta/sezóna */}
            {!isHidden("mealType") &&
                mealRoots.map((parent) => (
                    <Box key={parent.id} sx={{ mb: 2 }}>
                        <Checkbox
                            label={parent.name}
                            checked={filters.mealType.includes(parent.slug)}
                            onChange={() => onFilterChange("mealType", parent.slug)}
                        />
                        {childrenOf(parent.id).map((child) => (
                            <Checkbox
                                key={child.id}
                                label={child.name}
                                checked={filters.mealType.includes(child.slug)}
                                onChange={() => onFilterChange("mealType", child.slug)}
                                sx={{ pl: 2 }}
                            />
                        ))}
                        <Divider sx={{ mt: 1 }} />
                    </Box>
                ))}

            {/* Diety = děti kořene 'dieta' (pokud existuje) */}
            {!isHidden("diet") && dietRoot && (
                <Box sx={{ mb: 2 }}>
                    <Typography fontWeight="bold">{dietRoot.name}</Typography>
                    {childrenOf(dietRoot.id).map((d) => (
                        <Checkbox
                            key={d.id}
                            label={d.name}
                            checked={filters.diet.includes(d.slug)}
                            onChange={() => onFilterChange("diet", d.slug)}
                        />
                    ))}
                    <Divider sx={{ mt: 1 }} />
                </Box>
            )}

            {!isHidden("season") && seasonRoot && (
                <Box sx={{ mb: 2 }}>
                    <Typography fontWeight="bold">{seasonRoot.name}</Typography>
                    {childrenOf(seasonRoot.id).map((s) => (
                        <Checkbox
                            key={s.id}
                            label={s.name}
                            checked={filters.season.includes(s.slug)}
                            onChange={() => onFilterChange("season", s.slug)}
                        />
                    ))}
                    <Divider sx={{ mt: 1 }} />
                </Box>
            )}
        </Box>
    );
}
