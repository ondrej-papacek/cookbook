import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Categories } from "./pages/Categories";
import { AddRecipe } from "./pages/AddRecipe";
import { EditRecipe } from "./pages/EditRecipe";
import { RecipeDetail } from "./pages/RecipeDetail";
import { CategoryDetail } from "./pages/CategoryDetail";
import { AllRecipes } from "./pages/AllRecipes";

export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/categories/:slug" element={<CategoryDetail />} />
                    <Route path="/recepty" element={<AllRecipes />} />
                    <Route path="/recipes/:id" element={<RecipeDetail />} />
                    <Route path="/add" element={<AddRecipe />} />
                    <Route path="/edit/:id" element={<EditRecipe />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}
