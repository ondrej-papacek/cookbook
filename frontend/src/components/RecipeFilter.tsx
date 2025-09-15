import { Box, Typography, Divider } from "@mui/material";
import { Checkbox } from "./UI/Checkbox";
import { useEffect, useState } from "react";
import { getCategories, type Category } from "../api/categories";

type Sections = "mealType" | "diet" | "season";

export type RecipeFilterProps = {
    filters: Record<Sections, string[]>;
    onFilterChange: (section: Sections, value: string) => void;
    hiddenSections?: Sections[];
};

const DIETS = ["Vegan", "Vegetarian", "Gluten-free", "Dairy-free"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter"];

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
    const rootCats = categories.filter((c) => !c.parentId);

    return (
        <Box sx={{ p: 2, width: 250 }}>
            <Typography variant="h6" gutterBottom>
                Filtrovat recepty
            </Typography>

            {!isHidden("mealType") &&
                rootCats.map((parent) => (
                    <Box key={parent.id} sx={{ mb: 2 }}>
                        <Checkbox
                            label={parent.name}
                            checked={filters.mealType.includes(parent.slug)}
                            onChange={() => onFilterChange("mealType", parent.slug)}
                        />

                        {categories
                            .filter((c) => c.parentId === parent.id)
                            .map((child) => (
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

            {!isHidden("diet") && (
                <Box sx={{ mb: 2 }}>
                    <Typography fontWeight="bold">Dieta</Typography>
                    {DIETS.map((d) => (
                        <Checkbox
                            key={d}
                            label={d}
                            checked={filters.diet.includes(d)}
                            onChange={() => onFilterChange("diet", d)}
                        />
                    ))}
                    <Divider sx={{ mt: 1 }} />
                </Box>
            )}

            {!isHidden("season") && (
                <Box sx={{ mb: 2 }}>
                    <Typography fontWeight="bold">Sezóna</Typography>
                    {SEASONS.map((s) => (
                        <Checkbox
                            key={s}
                            label={s}
                            checked={filters.season.includes(s)}
                            onChange={() => onFilterChange("season", s)}
                        />
                    ))}
                    <Divider sx={{ mt: 1 }} />
                </Box>
            )}
        </Box>
    );
}
