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

type FilterSectionProps = {
    title?: string;
    options: Category[];
    selected: string[];
    onToggle: (slug: string) => void;
    nested?: boolean;
};

function FilterSection({ title, options, selected, onToggle, nested }: FilterSectionProps) {
    if (options.length === 0) return null;

    return (
        <Box sx={{ mb: 2 }}>
            {title && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <Typography fontWeight="bold">{title}</Typography>
                </>
            )}
            {options.map((opt) => (
                <Checkbox
                    key={opt.id}
                    label={opt.name}
                    checked={selected.includes(opt.slug)}
                    onChange={() => onToggle(opt.slug)}
                    sx={nested ? { pl: 2 } : undefined}
                />
            ))}
        </Box>
    );
}

function isDietCategory(cat: Category) {
    return ["dieta", "diet", "diety"].includes(cat.slug.toLowerCase()) ||
        cat.name.toLowerCase().includes("dieta");
}

function isSeasonCategory(cat: Category) {
    return ["sezona", "sezóna", "season", "seasons"].includes(cat.slug.toLowerCase()) ||
        cat.name.toLowerCase().includes("období");
}

export function RecipeFilter({
                                 filters,
                                 onFilterChange,
                                 hiddenSections = [],
                             }: RecipeFilterProps) {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const isHidden = (section: Sections) => hiddenSections.includes(section);

    const roots = useMemo(() => categories.filter((c) => !c.parentId), [categories]);
    const childrenOf = (parentId: string) =>
        categories.filter((c) => c.parentId === parentId);

    const dietRoot = roots.find(isDietCategory);
    const seasonRoot = roots.find(isSeasonCategory);

    const mealRoots = roots.filter(
        (r) => r.id !== dietRoot?.id && r.id !== seasonRoot?.id
    );

    return (
        <Box sx={{ p: 2, width: 250 }}>
            <Typography variant="h6" gutterBottom>
                Filtrovat recepty
            </Typography>

            {!isHidden("mealType") &&
                mealRoots.map((parent) => (
                    <FilterSection
                        key={parent.id}
                        options={[parent, ...childrenOf(parent.id)]}
                        selected={filters.mealType}
                        onToggle={(slug) => onFilterChange("mealType", slug)}
                        nested={false}
                    />
                ))}

            {!isHidden("diet") && dietRoot && (
                <FilterSection
                    title={dietRoot.name}
                    options={childrenOf(dietRoot.id)}
                    selected={filters.diet}
                    onToggle={(slug) => onFilterChange("diet", slug)}
                />
            )}

            {!isHidden("season") && seasonRoot && (
                <FilterSection
                    title={seasonRoot.name}
                    options={childrenOf(seasonRoot.id)}
                    selected={filters.season}
                    onToggle={(slug) => onFilterChange("season", slug)}
                />
            )}
        </Box>
    );
}
