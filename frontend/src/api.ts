import axios from "axios";

const API_URL = "http://localhost:8000"; // nebo Railway URL

export async function getRecipes() {
    const res = await axios.get(`${API_URL}/api/recipes`);
    return res.data;
}
