import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Checkbox } from "./UI/Checkbox";
import { useEffect, useMemo, useState } from "react";
import { getCategories, type Category } from "../api/categories";

type Sections = "mealType" | "diet" | "season";

export type RecipeFilterProps = {
    filters: Record<Sections, string[]>;
    onFilterChange: (section: Sections, value: string) => void;
    hiddenSections?: Sections[];
};

function ParentGroup({
                         parent,
                         children,
                         selected,
                         onToggle,
                     }: {
    parent: Category;
    children: Category[];
    selected: string[];
    onToggle: (slug: string) => void;
}) {
    return (
        <Box sx={{ mb: 1.5 }}>
            <Checkbox
                key={parent.id}
                label={parent.name}
                checked={selected.includes(parent.slug)}
                onChange={() => onToggle(parent.slug)}
                sx={{
                    fontWeight: "bold",
                    "& .MuiTypography-root": { fontSize: "1rem" },
                    ml: 0,
                }}
            />

            {children.length > 0 && (
                <Box sx={{ ml: 3, mt: 0.5 }}>
                    {children.map((c) => (
                        <Checkbox
                            key={c.id}
                            label={c.name}
                            checked={selected.includes(c.slug)}
                            onChange={() => onToggle(c.slug)}
                            sx={{
                                "& .MuiTypography-root": {
                                    fontSize: "0.92rem",
                                    color: "text.secondary",
                                },
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}

function CollapsibleSection({
                                title,
                                children,
                            }: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Accordion
            disableGutters
            square
            sx={{
                boxShadow: "none",
                border: "none",
                mb: 1,
                "&:before": { display: "none" },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ px: 0 }}
            >
                <Checkbox
                    label={title}
                    checked={false}
                    onChange={() => {}}
                    sx={{
                        ml: 0,
                        fontWeight: "bold",
                        "& .MuiTypography-root": { fontSize: "1rem" },
                    }}
                />
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pl: 3 }}>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}

function isDietCategory(cat: Category) {
    return (
        ["dieta", "diet", "diety"].includes(cat.slug.toLowerCase()) ||
        cat.name.toLowerCase().includes("dieta")
    );
}

function isSeasonCategory(cat: Category) {
    return (
        ["sezona", "sezóna", "season", "seasons"].includes(cat.slug.toLowerCase()) ||
        cat.name.toLowerCase().includes("období")
    );
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

    const roots = useMemo(
        () => categories.filter((c) => !c.parentId),
        [categories]
    );
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
                    <ParentGroup
                        key={parent.id}
                        parent={parent}
                        children={childrenOf(parent.id)}
                        selected={filters.mealType}
                        onToggle={(slug) => onFilterChange("mealType", slug)}
                    />
                ))}

            {!isHidden("diet") && dietRoot && (
                <CollapsibleSection title={dietRoot.name}>
                    {childrenOf(dietRoot.id).map((c) => (
                        <Checkbox
                            key={c.id}
                            label={c.name}
                            checked={filters.diet.includes(c.slug)}
                            onChange={() => onFilterChange("diet", c.slug)}
                            sx={{ display: "flex", width: "100%", py: 0.25 }}
                        />
                    ))}
                </CollapsibleSection>
            )}

            {!isHidden("season") && seasonRoot && (
                <CollapsibleSection title={seasonRoot.name}>
                    {childrenOf(seasonRoot.id).map((c) => (
                        <Checkbox
                            key={c.id}
                            label={c.name}
                            checked={filters.season.includes(c.slug)}
                            onChange={() => onFilterChange("season", c.slug)}
                            sx={{ display: "flex", width: "100%", py: 0.25 }}
                        />
                    ))}
                </CollapsibleSection>
            )}
        </Box>
    );
}
