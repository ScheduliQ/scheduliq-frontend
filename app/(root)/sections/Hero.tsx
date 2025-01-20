"use client";
import Image from "next/image";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import calendar from "../assets/cal1.png";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_66%)] md:ovreflow-x-clip">
      <div className="h-28 lg:h-12"> </div>
      <div className="container ">
        <div className="md:flex items-center">
          <motion.div
            className="md:w-[478px] lg:pl-8"
            initial={{ opacity: 0, y: 30 }} // התחלה: בלתי נראה, מעט למטה
            animate={{ opacity: 1, y: 0 }} // אנימציה לכניסה
            transition={{ duration: 0.8, ease: "easeOut" }} // זמן ואפקט
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001e80] text-transparent bg-clip-text"
              initial={{ scale: 0.8, opacity: 0 }} // התחל בקנה מידה קטן ואטום
              animate={{ scale: 1, opacity: 1 }} // הגדל חזרה והפוך לשקוף
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} // עיכוב קל ואנימציה חלקה
            >
              Effortless Scheduling with ScheduliQ!
            </motion.h1>
            <motion.p
              className="text-xl text-[#010D3E] tracking-tight mt-6"
              initial={{ opacity: 0, y: 20 }} // התחל באטימות נמוכה ומעט למטה
              animate={{ opacity: 1, y: 0 }} // העלה ושנה לאט
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              Smart, efficient, and tailored to your needs.
            </motion.p>
            <motion.div
              className="flex gap-1 items-center mt-[30px]"
              initial={{ opacity: 0, y: 20 }} // תחילת האנימציה
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ y: -2, opacity: 0.95 }} // תזוזה אנכית קלה ושינוי שקיפות
                whileTap={{ y: 1 }} // תזוזה למטה קלות בלחיצה
              >
                <PrimaryButton label="Get Started" href="/login" />
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <motion.img
              src={calendar.src}
              alt="calendar image"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:pl-96 lg:scale-125"
              initial={{ opacity: 0, y: 20 }} // אנימציית כניסה: שקיפות ותזוזה קלה
              animate={{
                opacity: 1,
                y: 0, // תזוזה למקומה המקורי
                translateY: [-30, 30], // אנימציה קיימת
              }}
              transition={{
                opacity: { duration: 1, ease: "easeOut" }, // משך אנימציית הכניסה
                y: { duration: 1, ease: "easeOut" }, // משך תזוזת הכניסה
                translateY: {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 2,
                  ease: "easeInOut",
                },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
