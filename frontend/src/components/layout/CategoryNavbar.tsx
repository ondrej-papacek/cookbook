import { Box, Button, Container, CircularProgress, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories } from "../../api/categories";
import type { Category } from "../../api/categories";

type Props = {
    onItemClick?: () => void;
};

export function CategoryNavbar({ onItemClick }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .finally(() => setLoading(false));
    }, []);

    return (
        <Box
            sx={{
                bgcolor: "grey.100",
                py: 1,
                borderBottom: 1,
                borderColor: "divider",
            }}
        >
            <Container
                sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                {loading ? (
                    <Stack direction="row" alignItems="center" gap={1} sx={{ py: 1 }}>
                        <CircularProgress size={20} />
                    </Stack>
                ) : (
                    <>
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                component={Link}
                                to={`/categories/${cat.slug}`}
                                variant="text"
                                color="inherit"
                                onClick={onItemClick}
                                sx={{ textTransform: "none" }}
                            >
                                {cat.name}
                            </Button>
                        ))}

                        <Button
                            component={Link}
                            to="/categories"
                            variant="outlined"
                            size="small"
                            onClick={onItemClick}
                            sx={{ ml: "auto" }}
                        >
                            Všechny kategorie
                        </Button>
                    </>
                )}
            </Container>
        </Box>
    );
}
