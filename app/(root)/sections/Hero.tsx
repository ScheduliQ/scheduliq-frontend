"use client";
import Image from "next/image";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import calendar from "../assets/cal1.png";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react"; // or any down arrow icon component

export const Hero = () => {
  return (
    <section className="pt-8 pb-20 md:pt-5 md:pb-10 bg-none md:overflow-x-clip">
      <div className="container mx-auto px-4">
        <div className="md:flex items-center justify-between">
          <motion.div
            className="md:w-[45%] lg:pl-8 xl:pl-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001e80] text-transparent bg-clip-text"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              Effortless Scheduling with ScheduliQ!
            </motion.h1>
            <motion.p
              className="text-xl text-[#010D3E] tracking-tight mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              Smart, efficient, and tailored to your needs.
            </motion.p>
            <motion.div
              className="flex gap-1 items-center mt-[30px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ y: -2, opacity: 0.95 }}
                whileTap={{ y: 1 }}
              >
                <PrimaryButton label="Get Started" href="/login" />
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="mt-20 md:mt-0 md:w-[50%] relative">
            <motion.img
              src={calendar.src}
              alt="calendar image"
              className="md:relative md:h-auto md:w-full md:max-w-none lg:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                translateY: [-30, 30],
              }}
              transition={{
                opacity: { duration: 1, ease: "easeOut" },
                y: { duration: 1, ease: "easeOut" },
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
        <motion.div
          className="relative bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: 1,
            y: [0, -15, 0], // Increased bounce height
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          aria-label="Scroll down"
        >
          <ChevronDown className="w-12 h-12 text-[#001e80] hover:text-[#000d3e] transition-colors" />{" "}
          {/* Increased size */}
        </motion.div>
      </div>
    </section>
  );
};
