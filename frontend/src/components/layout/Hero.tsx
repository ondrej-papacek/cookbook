import { Box, Typography, Container } from "@mui/material";

export function Hero() {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                bgcolor: "#000",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    position: "relative",
                    color: "white",
                    textAlign: "center",
                    backgroundImage: `url("/cookbook.png")`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top center",
                    height: { xs: "60vh", md: "75vh" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: "-64px",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(0,0,0,0.4)",
                    }}
                />

                {/* text */}
                <Container sx={{ position: "relative", zIndex: 1 }}>
                    <Typography
                        variant="h3"
                        gutterBottom
                        fontWeight="bold"
                        sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
                    >
                        Vítej v naší kuchařce
                    </Typography>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                    >
                        Ukládej, organizuj a vychutnávej si své oblíbené recepty
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}
