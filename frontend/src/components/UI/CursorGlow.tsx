import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
    const [isPointerFine, setIsPointerFine] = useState(false);

    useEffect(() => {
        setIsPointerFine(window.matchMedia("(pointer: fine)").matches);
    }, []);

    const x = useMotionValue(-500);
    const y = useMotionValue(-500);
    const springX = useSpring(x, { stiffness: 120, damping: 22 });
    const springY = useSpring(y, { stiffness: 120, damping: 22 });

    useEffect(() => {
        if (!isPointerFine) return;
        const move = (e: MouseEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, [isPointerFine, x, y]);

    if (!isPointerFine) return null;

    return (
        <motion.div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: 340,
                height: 340,
                borderRadius: "50%",
                background:
                    "radial-gradient(circle, rgba(141,110,99,0.14) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 9998,
                marginLeft: -170,
                marginTop: -170,
                x: springX,
                y: springY,
                mixBlendMode: "multiply",
            }}
        />
    );
}
