import { Box, Skeleton } from "@mui/material";

type Props = {
    count?: number;
};

export function RecipeGridSkeleton({ count = 8 }: Props) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                },
                gap: 2,
            }}
        >
            {Array.from({ length: count }).map((_, i) => (
                <Box key={i}>
                    <Skeleton
                        variant="rectangular"
                        height={200}
                        sx={{ borderRadius: 2 }}
                    />
                    <Skeleton variant="text" sx={{ mt: 1, width: "70%", height: 28 }} />
                    <Skeleton variant="text" sx={{ width: "45%" }} />
                </Box>
            ))}
        </Box>
    );
}
