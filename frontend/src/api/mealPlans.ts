import api from "./axios";

const API_PREFIX = "/api";

export type MealSlot = "obed" | "vecere";

export type PlannedMeal = {
    date: string;
    slot: MealSlot;
    recipeId: string;
    recipeName: string;
    recipeImage?: string;
};

export type MealPlan = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    meals: PlannedMeal[];
    createdAt?: string;
    updatedAt?: string;
};

export type MealPlanInput = Omit<MealPlan, "id" | "createdAt" | "updatedAt">;

export async function getMealPlans(): Promise<MealPlan[]> {
    const res = await api.get(`${API_PREFIX}/meal-plans`);
    return res.data;
}

export async function getMealPlan(id: string): Promise<MealPlan> {
    const res = await api.get(`${API_PREFIX}/meal-plans/${id}`);
    return res.data;
}

export async function createMealPlan(data: MealPlanInput): Promise<MealPlan> {
    const res = await api.post(`${API_PREFIX}/meal-plans`, data);
    return res.data;
}

export async function updateMealPlan(
    id: string,
    data: Partial<MealPlanInput>
): Promise<MealPlan> {
    const res = await api.patch(`${API_PREFIX}/meal-plans/${id}`, data);
    return res.data;
}

export async function deleteMealPlan(id: string): Promise<void> {
    await api.delete(`${API_PREFIX}/meal-plans/${id}`);
}
