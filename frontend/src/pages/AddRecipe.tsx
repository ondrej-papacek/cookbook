import { useState, useEffect } from "react";
import { Box, TextField, Typography, MenuItem } from "@mui/material";
import { Button } from "../components/UI/Button";
import { uploadImage } from "../services/cloudinary";
import axios from "axios";
import { getCategories, type Category } from "../api/categories";

const API_URL = import.meta.env.VITE_API_URL;

export function AddRecipe() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState(""); // will hold the slug
    const [categories, setCategories] = useState<Category[]>([]);
    const [ingredients, setIngredients] = useState("");
    const [steps, setSteps] = useState("");
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = await uploadImage(e.target.files[0]);
            setImage(url);
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`${API_URL}/api/recipes`, {
                name,
                category, // 🔑 this is the slug (e.g. "snidane")
                ingredients: ingredients.split("\n"),
                steps: steps.split("\n"),
                tags: [],
                image,
            });
            alert("Recept byl přidán!");
            // optional: clear form
            setName("");
            setCategory("");
            setIngredients("");
            setSteps("");
            setImage(null);
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

            {/* Dropdown for categories */}
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

            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Uložit
                </Button>
            </Box>
        </Box>
    );
}
