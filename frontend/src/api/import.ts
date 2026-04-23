import api from "./axios";

export type ImportedRecipe = {
    name: string;
    ingredients: string[];
    steps: string[];
    image?: string;
    prepTime?: number;
    cookTime?: number;
};

export async function importRecipeFromUrl(url: string): Promise<ImportedRecipe> {
    const res = await api.post("/api/import-recipe", { url });
    return res.data;
}
