import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Categories } from "./pages/Categories";
import { AddRecipe } from "./pages/AddRecipe";
import { EditRecipe } from "./pages/EditRecipe";
import { RecipeDetail } from "./pages/RecipeDetail";
import { CategoryDetail } from "./pages/CategoryDetail";
import { AllRecipes } from "./pages/AllRecipes";
import Login from "./pages/Login";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="categories/:slug" element={<CategoryDetail />} />
                    <Route path="recepty" element={<AllRecipes />} />
                    <Route path="recipes/:id" element={<RecipeDetail />} />
                    <Route path="add" element={<AddRecipe />} />
                    <Route path="edit/:id" element={<EditRecipe />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
