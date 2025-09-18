import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Box,
    Typography,
    List,
    ListItem,
    Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getCategories, type Category } from "../api/categories";
import { getRecipe } from "../api/recipes";
import { Button } from "../components/UI/Button";

export function RecipeDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<any>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (!id) return;
        getRecipe(id).then(setRecipe);
    }, [id]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const slugToName = useMemo(
        () => new Map(categories.map((c) => [c.slug, c.name])),
        [categories]
    );

    if (!recipe) return <p>Načítám...</p>;

    const categoryNames = (recipe.categories ?? []).map(
        (s: string) => slugToName.get(s) || s
    );

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 4 }}>
            {recipe.image && (
                <img
                    src={recipe.image}
                    alt={recipe.name}
                    style={{
                        width: "100%",
                        borderRadius: 8,
                        marginBottom: "1rem",
                    }}
                />
            )}

            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                    component={Link}
                    to={`/edit/${id}`}
                    variant="outlined"
                    startIcon={<EditIcon />}
                >
                    Upravit recept
                </Button>
            </Box>

            <Typography variant="h3" gutterBottom fontWeight="bold">
                {recipe.name}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" mb={3}>
                Kategorie: {categoryNames.join(", ")}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" gutterBottom fontWeight="bold">
                Ingredience
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1, mb: 3 }}>
                {(recipe.ingredients ?? []).map((ing: string, i: number) => (
                    <Box
                        key={i}
                        component="li"
                        sx={{
                            listStyleType: 'disc',
                            ml: 3,
                            lineHeight: 1.6,
                        }}
                    >
                        {ing}
                    </Box>
                ))}
            </Box>

            <Typography variant="h5" gutterBottom fontWeight="bold">
                Postup
            </Typography>
            <List sx={{ lineHeight: 1.6 }}>
                {(recipe.steps ?? []).map((step: string, i: number) => (
                    <ListItem
                        key={i}
                        sx={{
                            pl: 0,
                            py: 0.5,
                            display: "list-item",
                            listStyleType: "decimal",
                            ml: 2,
                        }}
                    >
                        {step}
                    </ListItem>
                ))}
            </List>

            {recipe.youtubeUrl && (
                <Box sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Video
                    </Typography>
                    <Box
                        sx={{
                            position: "relative",
                            paddingTop: "56.25%",
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >
                        <iframe
                            src={recipe.youtubeUrl.replace("watch?v=", "embed/")}
                            title="YouTube video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                border: "none",
                            }}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
}
