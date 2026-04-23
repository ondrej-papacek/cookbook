import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { ShoppingListProvider } from "./context/ShoppingListContext";
import { CursorGlow } from "./components/UI/CursorGlow";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <CursorGlow />
            <ShoppingListProvider>
                <App />
            </ShoppingListProvider>
        </ThemeProvider>
    </React.StrictMode>
);
