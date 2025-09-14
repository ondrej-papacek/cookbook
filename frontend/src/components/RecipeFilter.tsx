import { Box, Typography, Divider } from "@mui/material";
import { Checkbox } from "./UI/Checkbox";
import { useEffect, useState } from "react";
import { getCategories, type Category } from "../api/categories";

type FilterSectionProps = {
    title: string;
    options: string[];
    selected: string[];
    onChange: (option: string) => void;
};

function FilterSection({ title, options, selected, onChange }: FilterSectionProps) {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {title}
            </Typography>
            {options.map((opt) => (
                <Checkbox
                    key={opt}
                    label={opt}
                    checked={selected.includes(opt)}
                    onChange={() => onChange(opt)}
                />
            ))}
            <Divider sx={{ mt: 2 }} />
        </Box>
    );
}

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

    return (
        <Box sx={{ p: 2, width: 250 }}>
            <Typography variant="h6" gutterBottom>
                Filtrovat recepty
            </Typography>

            {/* Categories from Firestore */}
            {!isHidden("mealType") && (
                <FilterSection
                    title="Kategorie jídel"
                    options={categories.map((c) => c.name)}
                    selected={filters.mealType}
                    onChange={(v) => onFilterChange("mealType", v)}
                />
            )}
        </Box>
    );
}
