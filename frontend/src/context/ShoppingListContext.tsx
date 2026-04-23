import { createContext, useContext, type ReactNode } from "react";
import { useShoppingList } from "../hooks/useShoppingList";

type ShoppingListContextType = ReturnType<typeof useShoppingList>;

const ShoppingListContext = createContext<ShoppingListContextType | null>(null);

export function ShoppingListProvider({ children }: { children: ReactNode }) {
    const value = useShoppingList();
    return (
        <ShoppingListContext.Provider value={value}>
            {children}
        </ShoppingListContext.Provider>
    );
}

export function useShoppingListContext() {
    const ctx = useContext(ShoppingListContext);
    if (!ctx) throw new Error("useShoppingListContext must be used inside ShoppingListProvider");
    return ctx;
}
