import { useState, useCallback } from "react";

export type ShoppingItem = {
    id: string;
    ingredient: string;
    recipeId: string;
    recipeName: string;
    checked: boolean;
};

const KEY = "cookbook-shopping-list";

function load(): ShoppingItem[] {
    try {
        return JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {
        return [];
    }
}

function save(items: ShoppingItem[]) {
    localStorage.setItem(KEY, JSON.stringify(items));
}

export function useShoppingList() {
    const [items, setItems] = useState<ShoppingItem[]>(load);

    const update = useCallback((next: ShoppingItem[]) => {
        save(next);
        setItems(next);
    }, []);

    const addItem = useCallback(
        (ingredient: string, recipeId: string, recipeName: string) => {
            setItems((prev) => {
                const already = prev.some(
                    (i) => i.ingredient === ingredient && i.recipeId === recipeId
                );
                if (already) return prev;
                const next = [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        ingredient,
                        recipeId,
                        recipeName,
                        checked: false,
                    },
                ];
                save(next);
                return next;
            });
        },
        []
    );

    const addAll = useCallback(
        (ingredients: string[], recipeId: string, recipeName: string) => {
            setItems((prev) => {
                const existing = new Set(
                    prev
                        .filter((i) => i.recipeId === recipeId)
                        .map((i) => i.ingredient)
                );
                const toAdd = ingredients
                    .filter((ing) => !existing.has(ing))
                    .map((ing) => ({
                        id: crypto.randomUUID(),
                        ingredient: ing,
                        recipeId,
                        recipeName,
                        checked: false,
                    }));
                if (toAdd.length === 0) return prev;
                const next = [...prev, ...toAdd];
                save(next);
                return next;
            });
        },
        []
    );

    const removeItem = useCallback(
        (id: string) => {
            setItems((prev) => {
                const next = prev.filter((i) => i.id !== id);
                save(next);
                return next;
            });
        },
        []
    );

    const toggleChecked = useCallback((id: string) => {
        setItems((prev) => {
            const next = prev.map((i) =>
                i.id === id ? { ...i, checked: !i.checked } : i
            );
            save(next);
            return next;
        });
    }, []);

    const clearChecked = useCallback(() => {
        update(items.filter((i) => !i.checked));
    }, [items, update]);

    const clearAll = useCallback(() => {
        update([]);
    }, [update]);

    const isAdded = useCallback(
        (ingredient: string, recipeId: string) =>
            items.some(
                (i) => i.ingredient === ingredient && i.recipeId === recipeId
            ),
        [items]
    );

    const uncheckedCount = items.filter((i) => !i.checked).length;

    return {
        items,
        addItem,
        addAll,
        removeItem,
        toggleChecked,
        clearChecked,
        clearAll,
        isAdded,
        uncheckedCount,
    };
}
