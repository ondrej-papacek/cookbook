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
                    mt: "-64px",
                    height: { xs: "38vh", sm: "48vh", md: "60vh" },
                    overflow: "hidden",
                }}
            >
                <Box
                    component="img"
                    src="/cookbook-1440.png"
                    alt="Cookbook"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: { xs: "cover", md: "contain" },
                        objectPosition: "center",
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(0,0,0,0.35)",
                        zIndex: 1,
                    }}
                />

                <Container
                    sx={{
                        position: "absolute",
                        bottom: "10%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 2,
                        textAlign: "center",
                        px: 0,
                        maxWidth: "100%",
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: "rgba(64, 31, 10, 0.85)",
                            px: { xs: 2, sm: 4, md: 10 },
                            py: { xs: 2, sm: 3, md: 4 },
                            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                            width: "100%",
                            borderRadius: 3,
                        }}
                    >
                        <Typography
                            variant="h3"
                            gutterBottom
                            fontWeight="bold"
                            sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" } }}
                        >
                            Vítej v naší kuchařce
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ fontSize: { xs: "0.85rem", sm: "1rem", md: "1.25rem" } }}
                        >
                            Ukládej, organizuj a vychutnávej si své oblíbené recepty
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
