import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export type Category = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    order?: number;
};

export async function getCategories(): Promise<Category[]> {
    const res = await axios.get(`${API_URL}/api/categories`);
    return res.data;
}
