import { useEffect, useState } from "react";
import { getRecipes, type Recipe } from "../api/recipes";
import { getRandomRecipe } from "../api/recipes";

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

export function useRandomRecipe() {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchRandom = async () => {
        setLoading(true);
        try {
            const data = await getRandomRecipe();
            setRecipe(data);
        } finally {
            setLoading(false);
        }
    };

    return { recipe, loading, fetchRandom };
}
