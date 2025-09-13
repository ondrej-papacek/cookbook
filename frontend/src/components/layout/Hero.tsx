import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

export function Hero() {
    return (
        <Box
            sx={{
                position: "relative",
                color: "white",
                py: 12,
                textAlign: "center",
                backgroundImage: `url("https://res.cloudinary.com/demo/image/upload/w_1600,h_600,c_fill/food.jpg")`, // 🔥 replace with your Cloudinary URL
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Overlay for better text readability */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(0,0,0,0.5)",
                }}
            />

            {/* Content */}
            <Container sx={{ position: "relative", zIndex: 1 }}>
                <Typography variant="h3" gutterBottom fontWeight="bold">
                    Vítej v naší kuchařce
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Ukládej, organizuj, vychutnávej si všechny své oblíbené recepty na jednom místě
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    component={Link}
                    to="/categories"
                >
                    Prozkoumat recepty
                </Button>
            </Container>
        </Box>
    );
}
