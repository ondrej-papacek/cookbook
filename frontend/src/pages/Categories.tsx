import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    IconButton,
    TextField,
    Button,
    Stack,
    MenuItem,
} from "@mui/material";
import { Delete, Edit, DragIndicator } from "@mui/icons-material";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    type Category,
} from "../api/categories";

import {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult,
} from "@hello-pangea/dnd";


function slugifyWithParent(text: string, parentSlug?: string): string {
    const base = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");
    return parentSlug ? `${parentSlug}-${base}` : base;
}

export function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState("");
    const [parentId, setParentId] = useState<string | null>(null);
    const [editing, setEditing] = useState<Category | null>(null);

    const refresh = async () => {
        const cats = await getCategories();
        setCategories(cats);
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleAdd = async () => {
        if (!newName.trim()) return;

        const parentSlug = parentId
            ? categories.find((c) => c.id === parentId)?.slug
            : undefined;

        await createCategory({
            name: newName,
            slug: slugifyWithParent(newName, parentSlug),
            parentId,
        });

        setNewName("");
        setParentId(null);
        await refresh();
    };

    const handleUpdate = async () => {
        if (!editing) return;
        await updateCategory(editing.slug, {
            name: editing.name,
            description: editing.description,
        });
        setEditing(null);
        await refresh();
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Opravdu smazat kategorii?")) return;
        await deleteCategory(slug);
        await refresh();
    };

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const rootCats = categories.filter((c) => !c.parentId);
        const items = Array.from(rootCats);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);

        const prev = categories;
        setCategories(prev.map((cat) => {
            const i = items.findIndex((c) => c.slug === cat.slug);
            return i !== -1 ? { ...cat, order: i } : cat;
        }));

        try {
            await reorderCategories(items.map((cat, index) => ({ slug: cat.slug, order: index })));
        } catch (err) {
            console.error("Reorder failed", err);
            alert("Nepodařilo se změnit pořadí kategorií.");
            await refresh();
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Typography variant="h4" gutterBottom>
                Kategorie receptů
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                    label="Název"
                    size="small"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <TextField
                    select
                    label="Nadkategorie"
                    size="small"
                    value={parentId ?? ""}
                    onChange={(e) =>
                        setParentId(e.target.value || null)
                    }
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="">Žádná</MenuItem>
                    {categories
                        .filter((c) => !c.parentId)
                        .map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                </TextField>
                <Button variant="contained" onClick={handleAdd}>
                    Přidat
                </Button>
            </Stack>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="categories">
                    {(provided) => (
                        <List
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {categories
                                .filter((c) => !c.parentId)
                                .map((cat, index) => (
                                    <Draggable
                                        key={cat.id}
                                        draggableId={cat.id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <ListItem
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                secondaryAction={
                                                    <>
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() =>
                                                                setEditing(cat)
                                                            }
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() =>
                                                                handleDelete(cat.slug)
                                                            }
                                                        >
                                                            <Delete color="error" />
                                                        </IconButton>
                                                    </>
                                                }
                                            >
                                                <Box
                                                    {...provided.dragHandleProps}
                                                    sx={{ mr: 1, cursor: "grab" }}
                                                >
                                                    <DragIndicator />
                                                </Box>
                                                <Typography>{cat.name}</Typography>
                                            </ListItem>
                                        )}
                                    </Draggable>
                                ))}
                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </DragDropContext>

            {editing && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Upravit kategorii</Typography>
                    <TextField
                        fullWidth
                        label="Název"
                        value={editing.name}
                        onChange={(e) =>
                            setEditing({ ...editing, name: e.target.value })
                        }
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" onClick={handleUpdate}>
                        Uložit změny
                    </Button>
                </Box>
            )}
        </Box>
    );
}
