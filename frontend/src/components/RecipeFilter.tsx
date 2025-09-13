import { Box, Typography, Divider } from "@mui/material";
import { Checkbox } from "./UI/Checkbox";

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

export type RecipeFilterProps = {
    filters: {
        mealType: string[];
        diet: string[];
        season: string[];
        ingredient: string[];
    };
    onFilterChange: (section: keyof RecipeFilterProps["filters"], value: string) => void;
};

export function RecipeFilter({ filters, onFilterChange }: RecipeFilterProps) {
    return (
        <Box sx={{ p: 2, width: 250 }}>
            <Typography variant="h6" gutterBottom>
                Filtrovat recepty
            </Typography>

            <FilterSection
                title="Jídlo"
                options={["Snídaně", "Oběd", "Večeře", "Polévka", "Dezert"]}
                selected={filters.mealType}
                onChange={(v) => onFilterChange("mealType", v)}
            />

            <FilterSection
                title="Speciální dieta"
                options={["Vegan", "Vegetarián", "Bezlepková", "Bezmléčná"]}
                selected={filters.diet}
                onChange={(v) => onFilterChange("diet", v)}
            />

            <FilterSection
                title="Sezóna"
                options={["Jaro", "Léto", "Podzim", "Zima"]}
                selected={filters.season}
                onChange={(v) => onFilterChange("season", v)}
            />

            <FilterSection
                title="Ingredience"
                options={["Jablko", "Brambory", "Mrkev", "Rajče", "Kuře"]}
                selected={filters.ingredient}
                onChange={(v) => onFilterChange("ingredient", v)}
            />
        </Box>
    );
}
