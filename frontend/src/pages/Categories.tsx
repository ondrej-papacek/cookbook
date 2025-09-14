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


export function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState("");
    const [newSlug, setNewSlug] = useState("");
    const [editing, setEditing] = useState<Category | null>(null);

    const refresh = async () => {
        const cats = await getCategories();
        setCategories(cats);
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleAdd = async () => {
        if (!newName || !newSlug) return;
        await createCategory({ name: newName, slug: newSlug });
        setNewName("");
        setNewSlug("");
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

        const items = Array.from(categories);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);

        // Update local state immediately
        setCategories(items);

        // Persist new order to backend
        await reorderCategories(
            items.map((cat, index) => ({ slug: cat.slug, order: index }))
        );
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Typography variant="h4" gutterBottom>
                Kategorie receptů
            </Typography>

            {/* Add new category */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                    label="Název"
                    size="small"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <TextField
                    label="Slug"
                    size="small"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                />
                <Button variant="contained" onClick={handleAdd}>
                    Přidat
                </Button>
            </Stack>

            {/* Drag & Drop list */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="categories">
                    {(provided) => (
                        <List
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {categories.map((cat, index) => (
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

            {/* Edit inline form */}
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
