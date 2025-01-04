"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BackgroundAnimation() {
  const [snowflakes, setSnowflakes] = useState<{ top: string; left: string }[]>(
    []
  );

  useEffect(() => {
    const generatedSnowflakes = Array.from({ length: 50 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }));
    setSnowflakes(generatedSnowflakes);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-[-1] bg-gradient-to-b from-[#FCE6D4] to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {snowflakes.map((flake, index) => (
        <motion.svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="40"
          height="40"
          fill="none"
          style={{
            position: "absolute",
            top: flake.top,
            left: flake.left,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25, Math.random() * -50 + 25, 0],
            y: [0, Math.random() * 100, Math.random() * -100, 0],
            rotate: [0, 360],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: Math.random() * 6 + 4,
            delay: Math.random() * 2,
          }}
        >
          <defs>
            <linearGradient
              id={`gradient-${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FFFFFF" /> {/* כחול */}
              <stop offset="100%" stopColor="#FCE6D4" /> {/* FCE6D4 */}
            </linearGradient>
          </defs>
          <path
            fill={`url(#gradient-${index})`}
            d="M12 2.5c.69 0 1.25.56 1.25 1.25v6.793l3.146-3.146a1.25 1.25 0 111.768 1.768L13.25 12l4.914 4.914a1.25 1.25 0 01-1.768 1.768L12 13.957v6.793a1.25 1.25 0 11-2.5 0v-6.793l-3.146 3.146a1.25 1.25 0 01-1.768-1.768L10.75 12 5.836 7.086a1.25 1.25 0 011.768-1.768L12 10.25V3.75c0-.69.56-1.25 1.25-1.25z"
          />
        </motion.svg>
      ))}
    </motion.div>
  );
}
