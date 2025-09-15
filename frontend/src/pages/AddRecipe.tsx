import { useState, useEffect } from "react";
import { Box, TextField, Typography, MenuItem } from "@mui/material";
import { Button } from "../components/UI/Button";
import { uploadImage } from "../services/cloudinary";
import axios from "axios";
import { getCategories, type Category } from "../api/categories";

const API_URL = import.meta.env.VITE_API_URL;

const DIETS = ["Vegan", "Vegetarian", "Gluten-free", "Dairy-free"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter"];

export function AddRecipe() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState(""); // slug
    const [categories, setCategories] = useState<Category[]>([]);
    const [ingredients, setIngredients] = useState("");
    const [steps, setSteps] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [diet, setDiet] = useState<string[]>([]);
    const [season, setSeason] = useState("");

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = await uploadImage(e.target.files[0]);
            setImage(url);
        }
    };

    const toggleDiet = (d: string) => {
        setDiet((prev) =>
            prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
        );
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`${API_URL}/api/recipes`, {
                name,
                category,
                ingredients: ingredients.split("\n"),
                steps: steps.split("\n"),
                tags: [],
                image,
                diet,
                season,
            });
            alert("Recept byl přidán!");
            setName("");
            setCategory("");
            setIngredients("");
            setSteps("");
            setImage(null);
            setDiet([]);
            setSeason("");
        } catch (err) {
            console.error(err);
            alert("Nepodařilo se uložit recept.");
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Typography variant="h4" gutterBottom>
                Přidat recept
            </Typography>

            <TextField
                fullWidth
                label="Název"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
            />

            <TextField
                select
                fullWidth
                label="Kategorie"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                label="Ingredience (každá na nový řádek)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                multiline
                rows={4}
                label="Postup (každý krok na nový řádek)"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                Nahrát obrázek
                <input type="file" hidden onChange={handleImage} />
            </Button>
            {image && <img src={image} alt="preview" width={200} />}

            <Box sx={{ my: 2 }}>
                <Typography variant="h6">Dieta</Typography>
                {DIETS.map((d) => (
                    <Box key={d}>
                        <label>
                            <input
                                type="checkbox"
                                checked={diet.includes(d)}
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
                value={season}
                onChange={(e) => setSeason(e.target.value)}
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
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Uložit
                </Button>
            </Box>
        </Box>
    );
}
