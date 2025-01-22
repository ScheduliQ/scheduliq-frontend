"use client";
import { motion } from "framer-motion";

export const LogoTicker = () => {
  const textItems = [
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

  // חישוב רוחב התוכן למניעת הפסקות
  const totalItems = [...textItems, ...textItems]; // שכפול רשימה

  return (
    <div className="py-8 md:py-12 bg-white/30 overflow-hidden relative">
      {/* אפקט דהייה בצדדים */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to right, white, transparent 15%, transparent 85%, white)",
          // "linear-gradient(to right, #a6c5ed, transparent 15%, transparent 85%, white)",
        }}
      />

      <div className="relative w-screen">
        <motion.div
          className="flex gap-14 w-max text-lg font-semibold text-gray-700"
          animate={{
            translateX: ["0%", "-50%"], // תנועה עד אמצע השכפול
          }}
          transition={{
            repeat: Infinity, // אינסופי
            duration: textItems.length * 3, // זמן מחזור כללי
            ease: "linear", // תנועה חלקה
          }}
        >
          {totalItems.map((text, index) => (
            <p
              key={index}
              className="h-8 w-auto whitespace-nowrap"
              style={{
                padding: "0 10px",
                color: "#4A90E2",
                fontSize: "1.2rem",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {text}
            </p>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
