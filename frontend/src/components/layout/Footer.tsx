import { Box, Typography, Container } from "@mui/material";

export function Footer() {
    return (
        <Box
            sx={{
                bgcolor: "grey.200",
                py: 4,
                mt: "auto",
                textAlign: "center",
            }}
        >
            <Container>
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} Naše kuchařka. Všechny práva vyhrazena.
                </Typography>
            </Container>
        </Box>
    );
}
