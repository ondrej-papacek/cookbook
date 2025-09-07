import axios from "axios";

const API_URL = "https://cookbook-backend-production-2287.up.railway.app";

export async function getRecipes() {
    const res = await axios.get(`${API_URL}/api/recipes`);
    return res.data;
}
