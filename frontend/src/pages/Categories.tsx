import { useEffect, useState } from "react";
import { Box, Typography, List, ListItemButton } from "@mui/material";
import { Link } from "react-router-dom";
import { getCategories } from "../api/categories";
import type { Category } from "../api/categories";

export function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    return (
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Typography variant="h4" gutterBottom>
                Kategorie receptů
            </Typography>
            <List>
                {categories.map((cat) => (
                    <ListItemButton
                        key={cat.id}
                        component={Link}
                        to={`/categories/${cat.slug}`}
                    >
                        {cat.name}
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
}
