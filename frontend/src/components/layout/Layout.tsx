import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Divider } from "./Divider";
import { Footer } from "./Footer";
import { Container } from "@mui/material";

type Props = { children: React.ReactNode };

export function Layout({ children }: Props) {
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Hero />

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
