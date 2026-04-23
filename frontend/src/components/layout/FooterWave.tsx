import { Box } from "@mui/material";
import { ESPRESSO } from "../../theme";

export function FooterWave() {
    return (
        <Box
            sx={{
                display: "block",
                lineHeight: 0,
                overflow: "hidden",
                bgcolor: "background.default",
            }}
        >
            <svg
                viewBox="0 0 1440 64"
                preserveAspectRatio="none"
                style={{ width: "100%", height: 64, display: "block" }}
            >
                <path
                    d="M0,24 C240,60 480,0 720,36 C960,60 1200,8 1440,32 L1440,64 L0,64 Z"
                    fill={ESPRESSO}
                />
            </svg>
        </Box>
    );
}
