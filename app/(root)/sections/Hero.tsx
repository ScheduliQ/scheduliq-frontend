"use client";
import Image from "next/image";
import PrimaryButton from "../../components/PrimaryButton";
import calendar from "../assets/cal1.png";
import mockmobiles from "../assets/allphones.png";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#f0f7ff]/70 relative">
      <div className="container mx-auto px-4 md:px-8 relative">
        {/* Logo */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/logo.png"
            alt="ScheduliQ Logo"
            width={160}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </motion.div>

        {/* Mobile app image - positioned with absolute for desktop and different for mobile */}
        <motion.div
          className="hidden md:block absolute right-0 top-1/2 transform -translate-y-[52%] w-[65%] h-[130%] pointer-events-none pb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ zIndex: 2, right: "-5%" }}
        >
          <Image
            src={mockmobiles.src}
            alt="ScheduliQ mobile app"
            width={1500}
            height={1500}
            className="object-contain w-auto h-full scale-[1.4]"
            priority
            style={{ paddingBottom: "2rem" }}
          />
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between relative">
          {/* Left Content */}
          <motion.div
            className="w-full md:w-[45%] md:pr-4 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-[#001e80] via-[#0055b8] to-[#0088ff] bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Scheduling shouldn't be your biggest headache.
            </motion.h1>

            <motion.p
              className="text-base md:text-xl font-semibold mt-6 text-gray-700 border-l-4 border-[#0055b8] pl-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Empower teams with AI-driven shift planning that adapts to real
              life.
            </motion.p>

            <motion.p
              className="text-lg text-gray-700 mt-4 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              With ScheduliQ, every constraint, preferences,
              skills—automatically shapes the perfect schedule. Say goodbye to
              last-minute scrambles and hello to happy, productive teams.
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

          {/* Mobile only image (below content) */}
          <motion.div
            className="md:hidden w-full mt-10 relative z-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <Image
              src={mockmobiles.src}
              alt="ScheduliQ mobile app"
              width={800}
              height={800}
              className="w-full h-auto object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* Scroll indicator - moved outside the content div and given more margin-top */}
        <motion.div
          className="mt-16 md:mt-24 flex justify-center cursor-pointer relative z-10"
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
