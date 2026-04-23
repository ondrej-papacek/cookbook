import { useState, useEffect, useMemo } from "react";
import {
    TextField,
    Autocomplete,
    Avatar,
    Box,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { searchRecipes, type Recipe } from "../../api/recipes";
import { getCategories, type Category } from "../../api/categories";

export function SearchBar() {
    const [options, setOptions] = useState<Recipe[]>([]);
    const [input, setInput] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (input.length < 2) {
            setOptions([]);
            return;
        }
        const delay = setTimeout(() => {
            searchRecipes(input)
                .then(setOptions)
                .catch((err) => {
                    console.error("Search failed:", err);
                    setOptions([]);
                });
        }, 300);
        return () => clearTimeout(delay);
    }, [input]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const slugToName = useMemo(() => {
        const map = new Map<string, string>();
        categories.forEach((c) => map.set(c.slug, c.name));
        return map;
    }, [categories]);

    return (
        <Autocomplete<Recipe, false, false, true>
            freeSolo
            options={options}
            noOptionsText="Žádné výsledky"
            getOptionLabel={(option) =>
                typeof option === "string" ? option : option.name
            }
            renderOption={(props, option) => (
                <Box
                    component="li"
                    {...props}
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                    {option.image && (
                        <Avatar
                            src={option.image}
                            alt={option.name}
                            variant="square"
                            sx={{ width: 40, height: 40 }}
                        />
                    )}
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                            {option.name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            {(option.categories ?? [])
                                .map((s) => slugToName.get(s) || s)
                                .join(", ")}
                        </Typography>
                    </Box>
                </Box>
            )}
            onInputChange={(_, value) => setInput(value)}
            onChange={(_, value) => {
                if (value && typeof value !== "string") {
                    navigate(`/recipes/${value.id}`);
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Hledat recept..."
                    size="small"
                    variant="outlined"
                    fullWidth
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "#401f0a",
                            bgcolor: "white",
                            "& fieldset": { borderColor: "#401f0a" },
                            "&:hover fieldset": { borderColor: "#401f0a" },
                            "&.Mui-focused fieldset": { borderColor: "#401f0a" },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#401f0a",
                            "&.Mui-focused": { color: "#401f0a" },
                        },
                    }}
                />

            )}
        />
    );
}
