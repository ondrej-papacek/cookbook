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
    Stack,
    Collapse,
    Alert,
    CircularProgress,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { Button } from "../components/UI/Button";
import { uploadImage } from "../services/cloudinary";
import { getCategories, type Category } from "../api/categories";
import { createRecipe } from "../api/recipes";
import { importRecipeFromUrl } from "../api/import";
import TextareaAutosize from '@mui/material/TextareaAutosize';

const textareaStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '1rem',
    fontFamily: 'inherit',
    padding: '16.5px 14px',
    borderRadius: 4,
    border: '1px solid #ccc',
    resize: 'none',
    marginBottom: '1rem',
};

export function AddRecipe() {
    const [name, setName] = useState("");
    const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [ingredients, setIngredients] = useState("");
    const [steps, setSteps] = useState("");
    const [image, setImage] = useState<string | undefined>(undefined);
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [prepTime, setPrepTime] = useState<number | "">("");
    const [cookTime, setCookTime] = useState<number | "">("");

    // Import
    const [importUrl, setImportUrl] = useState("");
    const [importing, setImporting] = useState(false);
    const [importError, setImportError] = useState("");
    const [importOpen, setImportOpen] = useState(false);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = await uploadImage(e.target.files[0]);
            setImage(url);
        }
    };

    const roots = useMemo(() => categories.filter((c) => !c.parentId), [categories]);
    const childrenOf = (parentId: string) => categories.filter((c) => c.parentId === parentId);

    const handleImport = async () => {
        if (!importUrl.trim()) return;
        setImporting(true);
        setImportError("");
        try {
            const data = await importRecipeFromUrl(importUrl.trim());
            if (data.name) setName(data.name);
            if (data.ingredients?.length) setIngredients(data.ingredients.join("\n"));
            if (data.steps?.length) setSteps(data.steps.join("\n"));
            if (data.image) setImage(data.image);
            if (data.prepTime) setPrepTime(data.prepTime);
            if (data.cookTime) setCookTime(data.cookTime);
            setImportOpen(false);
            setImportUrl("");
        } catch (err: any) {
            const msg = err?.response?.data?.detail ?? "Nepodařilo se importovat recept.";
            setImportError(msg);
        } finally {
            setImporting(false);
        }
    };

    const handleSubmit = async () => {
        if (youtubeUrl && !youtubeUrl.includes("youtube.com/watch?v=")) {
            alert("Zadej prosím platnou YouTube URL.");
            return;
        }
        try {
            await createRecipe({
                name,
                categories: categoriesSelected,
                ingredients: ingredients.split("\n").filter(Boolean),
                steps: steps.split("\n").filter(Boolean),
                tags: [],
                image,
                youtubeUrl,
                prepTime: prepTime !== "" ? Number(prepTime) : undefined,
                cookTime: cookTime !== "" ? Number(cookTime) : undefined,
            });
            alert("Recept byl přidán!");
            setName("");
            setCategoriesSelected([]);
            setIngredients("");
            setSteps("");
            setImage(undefined);
            setYoutubeUrl("");
            setPrepTime("");
            setCookTime("");
        } catch (err) {
            console.error(err);
            alert("Nepodařilo se uložit recept.");
        }
    };

    return (
        <Box sx={{ maxWidth: { xs: "100%", sm: 600 }, mx: "auto" }}>
            <Typography variant="h4" gutterBottom>
                Přidat recept
            </Typography>

            {/* ── Import from URL ── */}
            <Box sx={{ mb: 3, p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
                <Button
                    variant="text"
                    size="small"
                    startIcon={<LinkIcon />}
                    onClick={() => { setImportOpen((o) => !o); setImportError(""); }}
                    sx={{ color: "text.secondary" }}
                >
                    Importovat z webu
                </Button>

                <Collapse in={importOpen}>
                    <Box sx={{ mt: 1.5 }}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                            <TextField
                                fullWidth
                                size="small"
                                label="URL receptu"
                                placeholder="https://www.cuketka.cz/..."
                                value={importUrl}
                                onChange={(e) => setImportUrl(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleImport(); }}
                            />
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleImport}
                                disabled={importing || !importUrl.trim()}
                                sx={{ flexShrink: 0 }}
                            >
                                {importing ? <CircularProgress size={18} /> : "Importovat"}
                            </Button>
                        </Stack>
                        {importError && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                                {importError}
                            </Alert>
                        )}
                        <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                            Zkontroluj a uprav importovaná data před uložením.
                        </Typography>
                    </Box>
                </Collapse>
            </Box>

            <TextField
                fullWidth
                label="Název"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    type="number"
                    label="Příprava (min)"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
                    slotProps={{ input: { inputProps: { min: 0 } } }}
                />
                <TextField
                    fullWidth
                    type="number"
                    label="Vaření (min)"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
                    slotProps={{ input: { inputProps: { min: 0 } } }}
                />
            </Stack>

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
                        <MenuItem key={root.id} value={root.slug}>{root.name}</MenuItem>,
                        ...childrenOf(root.id).map((child) => (
                            <MenuItem key={child.id} value={child.slug} sx={{ pl: 3 }}>
                                {child.name}
                            </MenuItem>
                        )),
                    ])}
                </Select>
            </FormControl>

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Ingredience (každá na nový řádek)
            </Typography>
            <TextareaAutosize
                minRows={3}
                style={textareaStyle}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
            />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Postup (každý krok na nový řádek)
            </Typography>
            <TextareaAutosize
                minRows={3}
                style={textareaStyle}
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
            />

            <TextField
                fullWidth
                label="YouTube video (URL)"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                Nahrát obrázek
                <input type="file" hidden onChange={handleImage} />
            </Button>
            {image && (
                <Box sx={{ mb: 2 }}>
                    <img src={image} alt="preview" style={{ width: 200, borderRadius: 4 }} />
                </Box>
            )}

            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Uložit
                </Button>
            </Box>
        </Box>
    );
}
