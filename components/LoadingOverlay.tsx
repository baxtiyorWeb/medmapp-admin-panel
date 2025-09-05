import React from "react";
import { easeInOut, motion } from "framer-motion";

const circleVariants = {
  start: { scale: 1 },
  end: { scale: 1.5 },
};



const circleTransition = (i: number) => ({
  repeat: Infinity,
  repeatType: "mirror" as const,
  duration: 0.6,
  delay: i * 0.2,
  ease: easeInOut,
}); 

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
      <div className="w-24 h-24 flex justify-around items-center">
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="block w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600"
            variants={circleVariants}
            initial="start"
            animate="end"
            transition={circleTransition(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingOverlay;
