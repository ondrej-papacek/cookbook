import { useEffect, useState } from "react";
import { Box, TextField, Typography, MenuItem } from "@mui/material";
import { Button } from "../components/UI/Button";
import { uploadImage } from "../services/cloudinary";
import { useParams, useNavigate } from "react-router-dom";
import { getCategories, type Category } from "../api/categories";
import { getRecipe, updateRecipe } from "../api/recipes";

const DIETS = ["Vegan", "Vegetarian", "Gluten-free", "Dairy-free"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter"];

export function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState<any>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (!id) return;
        getRecipe(id).then(setRecipe);
        getCategories().then(setCategories);
    }, [id]);

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = await uploadImage(e.target.files[0]);
            setRecipe({ ...recipe, image: url });
        }
    };

    const toggleDiet = (d: string) => {
        const current = recipe.diet || [];
        setRecipe({
            ...recipe,
            diet: current.includes(d)
                ? current.filter((x: string) => x !== d)
                : [...current, d],
        });
    };

    const handleSave = async () => {
        if (!id) return;
        await updateRecipe(id, recipe);
        alert("Recept byl aktualizován!");
        navigate(`/recipes/${id}`);
    };

    if (!recipe) return <p>Načítám...</p>;

    return (
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Typography variant="h4" gutterBottom>
                Upravit recept
            </Typography>

            <TextField
                fullWidth
                label="Název"
                value={recipe.name}
                onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
                sx={{ mb: 2 }}
            />

            <TextField
                select
                fullWidth
                label="Kategorie"
                value={recipe.category}
                onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
                sx={{ mb: 2 }}
            >
                {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.slug}>
                        {cat.name}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                fullWidth
                multiline
                rows={4}
                label="Ingredience"
                value={recipe.ingredients.join("\n")}
                onChange={(e) =>
                    setRecipe({ ...recipe, ingredients: e.target.value.split("\n") })
                }
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                multiline
                rows={4}
                label="Postup"
                value={recipe.steps.join("\n")}
                onChange={(e) =>
                    setRecipe({ ...recipe, steps: e.target.value.split("\n") })
                }
                sx={{ mb: 2 }}
            />

            <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                Změnit obrázek
                <input type="file" hidden onChange={handleImage} />
            </Button>
            {recipe.image && <img src={recipe.image} alt="preview" width={200} />}

            <Box sx={{ my: 2 }}>
                <Typography variant="h6">Dieta</Typography>
                {DIETS.map((d) => (
                    <Box key={d}>
                        <label>
                            <input
                                type="checkbox"
                                checked={recipe.diet?.includes(d)}
                                onChange={() => toggleDiet(d)}
                            />
                            {d}
                        </label>
                    </Box>
                ))}
            </Box>

            <TextField
                select
                fullWidth
                label="Sezóna"
                value={recipe.season || ""}
                onChange={(e) => setRecipe({ ...recipe, season: e.target.value })}
                sx={{ my: 2 }}
            >
                <MenuItem value="">Žádná</MenuItem>
                {SEASONS.map((s) => (
                    <MenuItem key={s} value={s}>
                        {s}
                    </MenuItem>
                ))}
            </TextField>

            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Uložit změny
                </Button>
            </Box>
        </Box>
    );
}
