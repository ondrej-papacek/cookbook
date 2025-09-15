import { useState, useEffect } from "react";
import {
    TextField,
    Autocomplete,
    Avatar,
    Box,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { searchRecipes, type Recipe } from "../../api/recipes";

export function SearchBar() {
    const [options, setOptions] = useState<Recipe[]>([]);
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (input.length < 2) {
            setOptions([]);
            return;
        }

        const delay = setTimeout(() => {
            searchRecipes(input)
                .then(setOptions)
                .catch(() => setOptions([]));
        }, 300);

        return () => clearTimeout(delay);
    }, [input]);

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
                        <Typography>{option.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {option.category}
                        </Typography>
                        {(option.diet?.length || option.season) && (
                            <Typography variant="caption" color="primary">
                                {option.diet?.join(", ")}{" "}
                                {option.season ? ` • ${option.season}` : ""}
                            </Typography>
                        )}
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
                            color: "white",
                            "& fieldset": {
                                borderColor: "white",
                            },
                            "&:hover fieldset": {
                                borderColor: "white",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "white",
                            },
                        },
                        "& .MuiInputLabel-root": {
                            color: "white",
                            "&.Mui-focused": {
                                color: "white",
                            },
                        },
                    }}
                />
            )}
        />
    );
}
