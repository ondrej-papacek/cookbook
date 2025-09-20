import { Box, Typography, Container } from "@mui/material";

export function Hero() {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                bgcolor: "#fff",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "1440px",
                    position: "relative",
                    color: "white",
                    textAlign: "center",
                    backgroundImage: `url("/cookbook-1440.png")`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top center",
                    height: { xs: "75vh", md: "75vh" },
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
                        bgcolor: "rgba(0,0,0,0.3)",
                        zIndex: 1,
                    }}
                />

                <Container
                    sx={{
                        position: "absolute",
                        top: "70%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 2,
                        textAlign: "center",
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: "rgba(64, 31, 10, 0.8)",
                            borderRadius: 2,
                            px: { xs: 2, md: 4 },
                            py: { xs: 2, md: 3 },
                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        }}
                    >
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
                            sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                        >
                            Ukládej, organizuj a vychutnávej si své oblíbené recepty
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
