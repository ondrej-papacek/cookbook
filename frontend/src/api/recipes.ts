// src/api/recipes.ts
import api from "./axios";

const API_PREFIX = "/api";

export type Recipe = {
    id: string;
    name: string;
    categories: string[];
    ingredients: string[];
    steps: string[];
    tags: string[];
    image?: string;
    youtubeUrl?: string;
};

export async function getRecipes(): Promise<Recipe[]> {
    const res = await api.get(`${API_PREFIX}/recipes`);
    return res.data;
}

export async function getRecipe(id: string): Promise<Recipe> {
    const res = await api.get(`${API_PREFIX}/recipes/${id}`);
    return res.data;
}

export async function getRandomRecipe(): Promise<Recipe> {
    const res = await api.get(`${API_PREFIX}/recipes/random`);
    return res.data;
}

export async function createRecipe(data: Omit<Recipe, "id">): Promise<Recipe> {
    const res = await api.post(`${API_PREFIX}/recipes`, data);
    return res.data;
}

export async function updateRecipe(
    id: string,
    data: Partial<Omit<Recipe, "id">>
): Promise<Recipe> {
    const res = await api.patch(`${API_PREFIX}/recipes/${id}`, data);
    return res.data;
}

export async function deleteRecipe(id: string): Promise<void> {
    await api.delete(`${API_PREFIX}/recipes/${id}`);
}

export async function searchRecipes(q: string): Promise<Recipe[]> {
    const res = await api.get(`${API_PREFIX}/recipes/search`, {
        params: { q },
    });
    return res.data;
}
