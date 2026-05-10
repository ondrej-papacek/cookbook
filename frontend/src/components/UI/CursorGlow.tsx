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

    const HALO_SIZE = 380;
    const CORE_SIZE = 130;

    return (
        <>
            {/* Outer halo — soft espresso (primary), wide and faint */}
            <motion.div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: HALO_SIZE,
                    height: HALO_SIZE,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(64,31,10,0.12) 0%, rgba(64,31,10,0.05) 40%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 9998,
                    marginLeft: -HALO_SIZE / 2,
                    marginTop: -HALO_SIZE / 2,
                    x: springX,
                    y: springY,
                    mixBlendMode: "multiply",
                }}
            />
            {/* Inner accent — secondary warm taupe, small focal warmth */}
            <motion.div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: CORE_SIZE,
                    height: CORE_SIZE,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(141,110,99,0.18) 0%, rgba(141,110,99,0.08) 50%, transparent 75%)",
                    pointerEvents: "none",
                    zIndex: 9999,
                    marginLeft: -CORE_SIZE / 2,
                    marginTop: -CORE_SIZE / 2,
                    x: springX,
                    y: springY,
                    mixBlendMode: "multiply",
                }}
            />
        </>
    );
}