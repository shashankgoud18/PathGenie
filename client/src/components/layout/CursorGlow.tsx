import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CursorGlow: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 200, mass: 0.5 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Offset by half of spotlight size (450px) to center it on cursor
      mouseX.set(e.clientX - 225);
      mouseY.set(e.clientY - 225);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        left: glowX,
        top: glowY,
        width: 450,
        height: 450,
      }}
    >
      <div 
        className="w-full h-full rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.04) 0%, rgba(6, 182, 212, 0.02) 40%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
    </motion.div>
  );
};

export default CursorGlow;
