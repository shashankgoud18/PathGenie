import React from "react";
import { motion } from "framer-motion";

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-[#050507] overflow-hidden pointer-events-none">
      {/* Deep dark base grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      
      {/* Blob 1: Deep Blue */}
      <motion.div
        className="absolute w-[45vw] h-[45vw] rounded-full bg-blue-600/10 blur-[130px] md:blur-[180px]"
        initial={{ x: "-10%", y: "10%" }}
        animate={{
          x: ["-10%", "20%", "-5%", "-10%"],
          y: ["10%", "-15%", "15%", "10%"],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "15%", left: "10%" }}
      />

      {/* Blob 2: Soft Violet */}
      <motion.div
        className="absolute w-[50vw] h-[50vw] rounded-full bg-purple-600/8 blur-[130px] md:blur-[180px]"
        initial={{ x: "20%", y: "-10%" }}
        animate={{
          x: ["20%", "-10%", "15%", "20%"],
          y: ["-10%", "15%", "-5%", "-10%"],
          scale: [1.1, 0.9, 1.05, 1.1],
        }}
        transition={{
          duration: 38,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "35%", right: "5%" }}
      />

      {/* Blob 3: Cyan Accent */}
      <motion.div
        className="absolute w-[35vw] h-[35vw] rounded-full bg-cyan-600/8 blur-[120px] md:blur-[160px]"
        initial={{ x: "0%", y: "40%" }}
        animate={{
          x: ["0%", "10%", "-20%", "0%"],
          y: ["40%", "15%", "25%", "40%"],
          scale: [0.95, 1.1, 0.85, 0.95],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "10%", left: "30%" }}
      />

      {/* Soft dark radial mask to focus intensity towards center */}
      <div 
        className="absolute inset-0 bg-radial-vignette pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 30%, #050507 90%)",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
