import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export type Recipe = {
    id: string;
    name: string;
    category: string;
    ingredients: string[];
    steps: string[];
    tags: string[];
    image?: string;
    diet?: string[];
    season?: string;
};

export async function getRecipes(): Promise<Recipe[]> {
    const res = await axios.get(`${API_URL}/api/recipes`);
    return res.data;
}
