import { useCallback, useEffect, useRef, useState } from "react";
import {
    createMealPlan,
    deleteMealPlan,
    getMealPlan,
    getMealPlans,
    updateMealPlan,
    type MealPlan,
    type MealPlanInput,
    type MealSlot,
    type PlannedMeal,
} from "../api/mealPlans";

export type { MealPlan, MealPlanInput, MealSlot, PlannedMeal };

export const SLOTS: MealSlot[] = ["obed", "vecere"];
export const SLOT_LABELS: Record<MealSlot, string> = {
    obed: "Oběd",
    vecere: "Večeře",
};

const MAX_RANGE_DAYS = 60;

export function localDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function parseDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
}

export function daysInRange(start: string, end: string): string[] {
    const s = parseDate(start);
    const e = parseDate(end);
    if (e < s) return [];
    const out: string[] = [];
    const cur = new Date(s);
    while (cur <= e && out.length < MAX_RANGE_DAYS) {
        out.push(localDateStr(cur));
        cur.setDate(cur.getDate() + 1);
    }
    return out;
}

function mondayOf(d: Date): Date {
    const out = new Date(d);
    const offset = (out.getDay() + 6) % 7;
    out.setDate(out.getDate() - offset);
    return out;
}

export function thisWeekRange(): { startDate: string; endDate: string } {
    const mon = mondayOf(new Date());
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return { startDate: localDateStr(mon), endDate: localDateStr(sun) };
}

export function nextWeekRange(): { startDate: string; endDate: string } {
    const mon = mondayOf(new Date());
    mon.setDate(mon.getDate() + 7);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return { startDate: localDateStr(mon), endDate: localDateStr(sun) };
}

export function formatRangeLabel(startDate: string, endDate: string): string {
    if (!startDate || !endDate) return "";
    const [, fm, fd] = startDate.split("-").map(Number);
    const [ly, lm, ld] = endDate.split("-").map(Number);
    return `${fd}. ${fm}. – ${ld}. ${lm}. ${ly}`;
}

export function defaultPlanName(startDate: string, endDate: string): string {
    return `Týden ${formatRangeLabel(startDate, endDate)}`;
}

export function countPlannedMeals(plan: Pick<MealPlan, "meals">): number {
    return plan.meals.length;
}

export function useMealPlans() {
    const [plans, setPlans] = useState<MealPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            setPlans(await getMealPlans());
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const create = useCallback(async (input: MealPlanInput) => {
        const created = await createMealPlan(input);
        setPlans((prev) => [...prev, created]);
        return created;
    }, []);

    const remove = useCallback(async (id: string) => {
        await deleteMealPlan(id);
        setPlans((prev) => prev.filter((p) => p.id !== id));
    }, []);

    return { plans, loading, error, refresh, create, remove };
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useMealPlanEditor(id: string | undefined) {
    const [plan, setPlan] = useState<MealPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [status, setStatus] = useState<SaveStatus>("idle");

    const loadedRef = useRef(false);
    const dirtyRef = useRef(false);
    const latestRef = useRef<MealPlanInput | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        loadedRef.current = false;
        dirtyRef.current = false;
        setLoading(true);
        setNotFound(false);
        setStatus("idle");
        getMealPlan(id)
            .then((p) => {
                if (!cancelled) setPlan(p);
            })
            .catch(() => {
                if (!cancelled) setNotFound(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    const editableKey = plan
        ? JSON.stringify({
              name: plan.name,
              startDate: plan.startDate,
              endDate: plan.endDate,
              meals: plan.meals,
          })
        : null;

    useEffect(() => {
        if (!plan || !id) return;
        latestRef.current = {
            name: plan.name,
            startDate: plan.startDate,
            endDate: plan.endDate,
            meals: plan.meals,
        };
        if (!loadedRef.current) {
            loadedRef.current = true;
            return;
        }
        dirtyRef.current = true;
        setStatus("saving");
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
            if (!latestRef.current) return;
            try {
                await updateMealPlan(id, latestRef.current);
                dirtyRef.current = false;
                setStatus("saved");
            } catch {
                setStatus("error");
            }
        }, 700);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [editableKey, id]);

    useEffect(() => {
        return () => {
            if (dirtyRef.current && id && latestRef.current) {
                updateMealPlan(id, latestRef.current).catch(() => {});
            }
        };
    }, [id]);

    const setName = useCallback((name: string) => {
        setPlan((p) => (p ? { ...p, name } : p));
    }, []);

    const setRange = useCallback((startDate: string, endDate: string) => {
        setPlan((p) => (p ? { ...p, startDate, endDate } : p));
    }, []);

    const addMeal = useCallback(
        (
            date: string,
            slot: MealSlot,
            recipe: { id: string; name: string; image?: string }
        ) => {
            setPlan((p) => {
                if (!p) return p;
                const meals = p.meals.filter(
                    (m) => !(m.date === date && m.slot === slot)
                );
                meals.push({
                    date,
                    slot,
                    recipeId: recipe.id,
                    recipeName: recipe.name,
                    recipeImage: recipe.image,
                });
                return { ...p, meals };
            });
        },
        []
    );

    const removeMeal = useCallback((date: string, slot: MealSlot) => {
        setPlan((p) =>
            p
                ? {
                      ...p,
                      meals: p.meals.filter(
                          (m) => !(m.date === date && m.slot === slot)
                      ),
                  }
                : p
        );
    }, []);

    const getMeal = useCallback(
        (date: string, slot: MealSlot): PlannedMeal | null =>
            plan?.meals.find((m) => m.date === date && m.slot === slot) ?? null,
        [plan]
    );

    const days = plan ? daysInRange(plan.startDate, plan.endDate) : [];

    return {
        plan,
        loading,
        notFound,
        status,
        days,
        setName,
        setRange,
        addMeal,
        removeMeal,
        getMeal,
    };
}