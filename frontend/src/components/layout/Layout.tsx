import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Divider } from "./Divider";
import { Footer } from "./Footer";
import { FooterWave } from "./FooterWave";
import { Container } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export function Layout() {
    const location = useLocation();

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Hero />
            <Divider />

            <main style={{ flex: 1 }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
                            <Outlet />
                        </Container>
                    </motion.div>
                </AnimatePresence>
            </main>

            <FooterWave />
            <Footer />
        </div>
    );
}
