import { Box, Typography, Divider } from "@mui/material";
import { Checkbox } from "./UI/Checkbox";
import { useEffect, useState } from "react";
import { getCategories, type Category } from "../api/categories";

type Sections = "mealType";

export type RecipeFilterProps = {
    filters: Record<Sections, string[]>;
    onFilterChange: (section: Sections, value: string) => void;
    hiddenSections?: Sections[];
};

export function RecipeFilter({ filters, onFilterChange, hiddenSections = [] }: RecipeFilterProps) {
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
                        <Typography fontWeight="bold">{parent.name}</Typography>

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
        </Box>
    );
}
