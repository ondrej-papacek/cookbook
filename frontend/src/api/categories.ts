import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export type Category = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    order?: number;
    parentId?: string | null;
};

export async function getCategories(): Promise<Category[]> {
    const res = await axios.get(`${API_URL}/api/categories`);
    return res.data;
}

export async function createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string | null;
}): Promise<Category> {
    const res = await axios.post(`${API_URL}/api/categories`, data);
    return res.data;
}

export async function updateCategory(
    slug: string,
    data: Partial<Omit<Category, "id" | "slug">>
): Promise<Category> {
    const res = await axios.patch(`${API_URL}/api/categories/${slug}`, data);
    return res.data;
}

export async function deleteCategory(slug: string): Promise<void> {
    await axios.delete(`${API_URL}/api/categories/${slug}`);
}

export async function reorderCategories(items: { slug: string; order: number }[]): Promise<void> {
    await axios.patch(`${API_URL}/api/categories/reorder`, items, {
        headers: { "Content-Type": "application/json" },
    });
}
