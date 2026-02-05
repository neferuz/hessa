"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
    icon: LucideIcon;
    size?: number;
    className?: string;
}

export default function AnimatedIcon({ icon: Icon, size = 20, className }: AnimatedIconProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={className}
        >
            <Icon size={size} />
        </motion.div>
    );
}
