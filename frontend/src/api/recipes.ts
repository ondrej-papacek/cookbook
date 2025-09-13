import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getRecipes() {
    const res = await axios.get(`${API_URL}/api/recipes`);
    return res.data;
}
