import { Box, Typography, Container } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" as const },
    },
};

export function Hero() {
    const { scrollY } = useScroll();
    const imageY = useTransform(scrollY, [0, 500], [0, 140]);
    const textY = useTransform(scrollY, [0, 500], [0, 55]);

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
                    mt: "-64px",
                    height: { xs: "50vh", sm: "58vh", md: "70vh" },
                    overflow: "hidden",
                }}
            >
                {/* Parallax image layer — extends beyond container to allow movement */}
                <motion.div
                    style={{
                        y: imageY,
                        position: "absolute",
                        top: "-15%",
                        left: 0,
                        right: 0,
                        bottom: "-15%",
                    }}
                >
                    <Box
                        component="img"
                        src="/hero-cookbook-1.jpg"
                        alt="Cookbook"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                            display: "block",
                        }}
                    />
                </motion.div>

                {/* Gradient vignette overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            "radial-gradient(ellipse at 60% 50%, rgba(64,31,10,0.22) 0%, rgba(42,18,5,0.68) 100%)",
                        zIndex: 1,
                    }}
                />

                {/* Staggered text entrance */}
                <Container
                    sx={{
                        position: "absolute",
                        bottom: "14%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 2,
                        textAlign: "center",
                        px: { xs: 3, sm: 4 },
                        maxWidth: "100%",
                    }}
                >
                    <motion.div
                        style={{ y: textY }}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                sx={{
                                    fontSize: {
                                        xs: "1.7rem",
                                        sm: "2.2rem",
                                        md: "3.2rem",
                                    },
                                    textShadow: "0 2px 16px rgba(0,0,0,0.6)",
                                    mb: 1,
                                    color: "white",
                                }}
                            >
                                Vítej v naší kuchařce
                            </Typography>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: {
                                        xs: "0.9rem",
                                        sm: "1.05rem",
                                        md: "1.25rem",
                                    },
                                    textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                                    opacity: 0.92,
                                    fontWeight: 400,
                                    color: "white",
                                }}
                            >
                                Ukládej, organizuj a vychutnávej si své oblíbené recepty
                            </Typography>
                        </motion.div>
                    </motion.div>
                </Container>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        position: "absolute",
                        bottom: 16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 2,
                        color: "rgba(255,255,255,0.55)",
                    }}
                >
                    <KeyboardArrowDownIcon sx={{ fontSize: 32, color: "inherit" }} />
                </motion.div>
            </Box>
        </Box>
    );
}
