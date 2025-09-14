import { useEffect, useState } from "react";
import { getRecipes } from "../api/recipes";


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

export function useRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const data = await getRecipes();
            setRecipes(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    return { recipes, loading, refresh: fetchRecipes };
}
