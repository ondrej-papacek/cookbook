import { motion } from "framer-motion";

type Props = {
    children: React.ReactNode;
    delay?: number;
    y?: number;
};

export function RevealOnScroll({ children, delay = 0, y = 28 }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay }}
        >
            {children}
        </motion.div>
    );
}
