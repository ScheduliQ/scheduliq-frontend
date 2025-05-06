"use client";
import Image from "next/image";
import PrimaryButton from "../../components/PrimaryButton";
import calendar from "../assets/cal1.png";
import mockmobiles from "../assets/mockmobiles.png";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="pt-8 pb-16 md:pt-16 md:pb-20 overflow-hidden bg-[#f0f7ff]/70">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <motion.div
            className="w-full md:w-[45%] md:pr-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              1 in 3 managers struggle with scheduling
            </motion.h1>

            <motion.p
              className="text-base md:text-xl text-blue-500 font-medium uppercase tracking-wide mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              The accumulating workplace stress affects productivity
            </motion.p>

            <motion.p
              className="text-lg text-gray-700 mt-4 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              ScheduliQ transforms workforce management with AI-powered
              scheduling that's smart, efficient, and tailored to your needs.
            </motion.p>

            <motion.div
              className="mt-8 flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <PrimaryButton label="Get Started" href="/login" />
            </motion.div>
          </motion.div>

          {/* Right Phone Image */}
          <motion.div
            className="w-full md:w-[55%] relative max-w-xl mx-auto md:mx-0 flex justify-center md:justify-end"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative h-[450px] md:h-[580px] w-auto">
              <Image
                src={calendar.src}
                alt="ScheduliQ mobile app"
                width={1200}
                height={2400}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-12 flex justify-center cursor-pointer"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: [0, -8, 0],
          }}
          transition={{
            delay: 1,
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8 text-[#001e80] hover:text-[#000d3e] transition-colors" />
        </motion.div>
      </div>
    </section>
  );
};
