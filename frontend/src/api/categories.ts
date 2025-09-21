import api from "./axios";

const API_PREFIX = "/api";

export type Category = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    order?: number;
    parentId?: string | null;
};

export async function getCategories(): Promise<Category[]> {
    const res = await api.get(`${API_PREFIX}/categories`);
    return res.data;
}

export async function createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string | null;
}): Promise<Category> {
    const res = await api.post(`${API_PREFIX}/categories`, data);
    return res.data;
}

export async function updateCategory(
    id: string,
    data: Partial<Category>
): Promise<Category> {
    const res = await api.patch(`${API_PREFIX}/categories/${id}`, data);
    return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
    await api.delete(`${API_PREFIX}/categories/${id}`);
}

export async function reorderCategories(
    items: { id: string; order: number }[]
): Promise<void> {
    await api.patch(`${API_PREFIX}/categories/reorder`, { items });
}
