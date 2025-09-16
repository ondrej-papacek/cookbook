import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export type Recipe = {
    id: string;
    name: string;
    categories: string[];
    ingredients: string[];
    steps: string[];
    tags: string[];
    image?: string;
};

export async function getRecipes(): Promise<Recipe[]> {
    const res = await axios.get(`${API_URL}/api/recipes`);
    return res.data;
}

export async function getRecipe(id: string): Promise<Recipe> {
    const res = await axios.get(`${API_URL}/api/recipes/${id}`);
    return res.data;
}

export async function createRecipe(data: Omit<Recipe, "id">): Promise<Recipe> {
    const res = await axios.post(`${API_URL}/api/recipes`, data);
    return res.data;
}

export async function updateRecipe(
    id: string,
    data: Partial<Omit<Recipe, "id">>
): Promise<Recipe> {
    const res = await axios.patch(`${API_URL}/api/recipes/${id}`, data);
    return res.data;
}

export async function deleteRecipe(id: string): Promise<void> {
    await axios.delete(`${API_URL}/api/recipes/${id}`);
}

export async function searchRecipes(q: string): Promise<Recipe[]> {
    const res = await axios.get(
        `${API_URL}/api/recipes/search?q=${encodeURIComponent(q)}`
    );
    return res.data;
}
