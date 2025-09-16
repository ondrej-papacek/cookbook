import { useState, useEffect, useMemo } from "react";
import {
    Box,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    TextField,
} from "@mui/material";
import { Button } from "../components/UI/Button";
import { uploadImage } from "../services/cloudinary";
import { getCategories, type Category } from "../api/categories";
import { createRecipe } from "../api/recipes";

export function AddRecipe() {
    const [name, setName] = useState("");
    const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [ingredients, setIngredients] = useState("");
    const [steps, setSteps] = useState("");
    const [image, setImage] = useState<string | undefined>(undefined);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = await uploadImage(e.target.files[0]);
            setImage(url);
        }
    };

    const roots = useMemo(
        () => categories.filter((c) => !c.parentId),
        [categories]
    );
    const childrenOf = (parentId: string) =>
        categories.filter((c) => c.parentId === parentId);

    const handleSubmit = async () => {
        try {
            await createRecipe({
                name,
                categories: categoriesSelected,
                ingredients: ingredients.split("\n").filter(Boolean),
                steps: steps.split("\n").filter(Boolean),
                tags: [],
                image,
            });
            alert("Recept byl přidán!");
            setName("");
            setCategoriesSelected([]);
            setIngredients("");
            setSteps("");
            setImage(undefined);
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

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="categories-label">Kategorie</InputLabel>
                <Select
                    labelId="categories-label"
                    multiple
                    value={categoriesSelected}
                    onChange={(e) => setCategoriesSelected(e.target.value as string[])}
                    input={<OutlinedInput label="Kategorie" />}
                    renderValue={(selected) =>
                        (selected as string[])
                            .map((slug) => categories.find((c) => c.slug === slug)?.name || slug)
                            .join(", ")
                    }
                >
                    {roots.map((root) => [
                        <MenuItem key={root.id} value={root.slug}>
                            {root.name}
                        </MenuItem>,
                        ...childrenOf(root.id).map((child) => (
                            <MenuItem key={child.id} value={child.slug} sx={{ pl: 3 }}>
                                {child.name}
                            </MenuItem>
                        )),
                    ])}
                </Select>
            </FormControl>

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
