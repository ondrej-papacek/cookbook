import { useState } from "react";

export type MealSlot = "obed" | "vecere";

export type PlannedMeal = {
    id: string;
    date: string;       // YYYY-MM-DD
    slot: MealSlot;
    recipeId: string;
    recipeName: string;
    recipeImage?: string;
};

const KEY = "cookbook-meal-plan";

function load(): PlannedMeal[] {
    try {
        return JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {
        return [];
    }
}

function save(meals: PlannedMeal[]) {
    localStorage.setItem(KEY, JSON.stringify(meals));
}

export function useMealPlan() {
    const [meals, setMeals] = useState<PlannedMeal[]>(load);

    const addMeal = (
        date: string,
        slot: MealSlot,
        recipe: { id: string; name: string; image?: string }
    ) => {
        setMeals((prev) => {
            // Replace if same date+slot already has a recipe
            const filtered = prev.filter((m) => !(m.date === date && m.slot === slot));
            const next: PlannedMeal[] = [
                ...filtered,
                {
                    id: crypto.randomUUID(),
                    date,
                    slot,
                    recipeId: recipe.id,
                    recipeName: recipe.name,
                    recipeImage: recipe.image,
                },
            ];
            save(next);
            return next;
        });
    };

    const removeMeal = (id: string) => {
        setMeals((prev) => {
            const next = prev.filter((m) => m.id !== id);
            save(next);
            return next;
        });
    };

    const getMeal = (date: string, slot: MealSlot): PlannedMeal | null =>
        meals.find((m) => m.date === date && m.slot === slot) ?? null;

    return { meals, addMeal, removeMeal, getMeal };
}
