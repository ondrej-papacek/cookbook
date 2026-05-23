import { formatRangeLabel, thisWeekRange } from "../hooks/useMealPlan";
import type { MealPlanInput, MealSlot } from "../api/mealPlans";

const LEGACY_KEY = "cookbook-meal-plan";
const FLAG = "cookbook-meal-plan-migrated";

type LegacyMeal = {
    date: string;
    slot: MealSlot;
    recipeId: string;
    recipeName: string;
    recipeImage?: string;
};

let inFlight = false;

export async function migrateLegacyMealPlan(
    create: (input: MealPlanInput) => Promise<unknown>
): Promise<boolean> {
    if (inFlight) return false;
    inFlight = true;
    try {
        if (localStorage.getItem(FLAG)) return false;

        const raw = localStorage.getItem(LEGACY_KEY);
        if (!raw) {
            localStorage.setItem(FLAG, "1");
            return false;
        }

        let legacy: LegacyMeal[];
        try {
            legacy = JSON.parse(raw);
        } catch {
            localStorage.setItem(FLAG, "1");
            return false;
        }

        if (!Array.isArray(legacy) || legacy.length === 0) {
            localStorage.setItem(FLAG, "1");
            return false;
        }

        const dates = legacy.map((m) => m.date).filter(Boolean).sort();
        const startDate = dates[0] ?? thisWeekRange().startDate;
        const endDate = dates[dates.length - 1] ?? thisWeekRange().endDate;

        const meals = legacy.map((m) => ({
            date: m.date,
            slot: m.slot,
            recipeId: m.recipeId,
            recipeName: m.recipeName,
            recipeImage: m.recipeImage,
        }));

        await create({
            name: `Jídelníček ${formatRangeLabel(startDate, endDate)}`,
            startDate,
            endDate,
            meals,
        });

        localStorage.setItem(FLAG, "1");
        localStorage.removeItem(LEGACY_KEY);
        return true;
    } catch {
        return false;
    } finally {
        inFlight = false;
    }
}