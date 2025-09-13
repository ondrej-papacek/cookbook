import { useEffect, useState } from "react";
import { Box, TextField, Typography, MenuItem } from "@mui/material";
import { Button } from "../components/UI/Button";
import { uploadImage } from "../services/cloudinary";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getCategories, type Category } from "../api/categories";

const API_URL = import.meta.env.VITE_API_URL;

export function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState<any>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        axios.get(`${API_URL}/api/recipes/${id}`).then((res) => setRecipe(res.data));

        getCategories().then(setCategories);
    }, [id]);

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = await uploadImage(e.target.files[0]);
            setRecipe({ ...recipe, image: url });
        }
    };

    const handleSave = async () => {
        await axios.patch(`${API_URL}/api/recipes/${id}`, recipe);
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

            {/* Category dropdown instead of free text */}
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

            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Uložit změny
                </Button>
            </Box>
        </Box>
    );
}
