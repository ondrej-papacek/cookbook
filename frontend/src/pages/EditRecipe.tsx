import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
} from "@mui/material";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Button } from "../components/UI/Button";
import { uploadImage } from "../services/cloudinary";
import { useParams, useNavigate } from "react-router-dom";
import { getCategories, type Category } from "../api/categories";
import { getRecipe, updateRecipe } from "../api/recipes";

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

    const roots = useMemo(
        () => categories.filter((c) => !c.parentId),
        [categories]
    );
    const childrenOf = (parentId: string) =>
        categories.filter((c) => c.parentId === parentId);

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = await uploadImage(e.target.files[0]);
            setRecipe({ ...recipe, image: url });
        }
    };

    const handleSave = async () => {
        if (recipe.youtubeUrl && !recipe.youtubeUrl.includes("youtube.com/watch?v=")) {
            alert("Zadej prosím platnou YouTube URL.");
            return;
        }

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

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="categories-label">Kategorie</InputLabel>
                <Select
                    labelId="categories-label"
                    multiple
                    value={recipe.categories ?? []}
                    onChange={(e) =>
                        setRecipe({ ...recipe, categories: e.target.value as string[] })
                    }
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

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Ingredience
            </Typography>
            <TextareaAutosize
                minRows={3}
                style={{
                    width: '100%',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    padding: '16.5px 14px',
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    resize: 'none',
                    marginBottom: '1rem',
                }}
                value={(recipe.ingredients ?? []).join("\n")}
                onChange={(e) =>
                    setRecipe({ ...recipe, ingredients: e.target.value.split("\n") })
                }
            />

            <TextareaAutosize
                minRows={3}
                style={{
                    width: '100%',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    padding: '16.5px 14px',
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    resize: 'none',
                }}
                value={(recipe.steps ?? []).join("\n")}
                onChange={(e) =>
                    setRecipe({ ...recipe, steps: e.target.value.split("\n") })
                }
            />

            <TextField
                fullWidth
                label="YouTube video (URL)"
                value={recipe.youtubeUrl || ""}
                onChange={(e) =>
                    setRecipe({ ...recipe, youtubeUrl: e.target.value })
                }
                sx={{ mb: 2 }}
            />

            <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                Změnit obrázek
                <input type="file" hidden onChange={handleImage} />
            </Button>

            {recipe.image && (
                <Box sx={{ mb: 3 }}>
                    <img
                        src={recipe.image}
                        alt="preview"
                        width={200}
                        style={{ borderRadius: 4, marginTop: 8 }}
                    />
                </Box>
            )}

            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Uložit změny
                </Button>
            </Box>
        </Box>
    );
}
