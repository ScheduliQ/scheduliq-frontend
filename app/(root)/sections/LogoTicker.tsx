"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const LogoTicker = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const notificationItems = [
    "The next shift starts at 08:00",
    "Please check your shift schedule",
    "Yossi's shift has been moved to Station 2",
    "Break times are now available in the app",
    "Reminder: Night shift starts at 22:00",
    "Please confirm your Thursday shift",
    "A new assignment has been updated at Workstation 3",
    "Pay attention to changes in the shift schedule",
    "Thank you for your cooperation in weekly shifts",
  ];

  const totalItems = [...notificationItems, ...notificationItems];

  return (
    <div className="py-6 md:py-10 bg-gradient-to-r from-blue-50 via-white to-blue-50 relative overflow-hidden border-y border-blue-100/40">
      {/* Gradient fade edges */}
      <div
        className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, white, rgba(255,255,255,0))",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to left, white, rgba(255,255,255,0))",
        }}
      />

      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-10 w-max"
          animate={{
            x: isMobile ? [0, -1500] : [0, -3000],
          }}
          transition={{
            repeat: Infinity,
            duration: 40,
            ease: "linear",
          }}
        >
          {totalItems.map((text, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-blue-100/70"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <p
                className="text-sm md:text-base font-medium whitespace-nowrap"
                style={{
                  color: "#3a5998",
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
