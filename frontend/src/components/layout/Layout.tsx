import { Navbar } from "./Navbar";
import { CategoryNavbar } from "./CategoryNavbar";
import { Hero } from "./Hero";
import { Divider } from "./Divider";
import { Footer } from "./Footer";
import { Container } from "@mui/material";

type Props = { children: React.ReactNode };

export function Layout({ children }: Props) {
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Hero with nav overlay */}
            <div style={{ position: "relative" }}>
                <Hero />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                    <Navbar />
                    <CategoryNavbar />
                </div>
            </div>

            <Divider />

            <main style={{ flex: 1 }}>
                <Container maxWidth="lg" sx={{ pb: 6 }}>
                    {children}
                </Container>
            </main>

            <Divider />
            <Footer />
        </div>
    );
}
