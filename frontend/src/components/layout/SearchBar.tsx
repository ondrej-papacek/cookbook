import { useState, useEffect } from "react";
import {
    TextField,
    Autocomplete,
    Avatar,
    Box,
    Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export type Recipe = {
    id: string;
    name: string;
    category: string;
    image?: string; // Cloudinary URL
};

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
            axios
                .get(`${API_URL}/api/recipes/search?q=${input}`)
                .then((res) => setOptions(res.data))
                .catch(() => setOptions([]));
        }, 300);

        return () => clearTimeout(delay);
    }, [input]);

    return (
        <Autocomplete<Recipe, false, false, true>
            freeSolo
            options={options}
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
