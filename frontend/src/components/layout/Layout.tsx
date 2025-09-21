import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Divider } from "./Divider";
import { Footer } from "./Footer";
import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export function Layout() {
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Hero />
            <Divider />

            <main style={{ flex: 1 }}>
                <Container maxWidth="lg" sx={{ pb: 6 }}>
                    <Outlet />
                </Container>
            </main>

            <Divider />
            <Footer />
        </div>
    );
}
