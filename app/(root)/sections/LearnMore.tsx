"use client";
import Image from "next/image";
import heropic from "../assets/heropic.png";
import { motion } from "framer-motion";
const supportOptions = [
  {
    title: "24/7 Live Chat",
    description:
      "Get real-time assistance from our support team, anytime you need it.",
    icon: "💬",
  },
  {
    title: "Knowledge Base",
    description:
      "Access a library of tutorials, FAQs, and troubleshooting guides.",
    icon: "📚",
  },
  {
    title: "Email Support",
    description:
      "Reach out for detailed help on advanced topics and custom requests.",
    icon: "✉️",
  },
];
const features = [
  {
    title: "Smart Scheduling Algorithm",
    description:
      "Automates shift assignments quickly, ensuring efficiency and fairness for your workforce.",
    icon: "⚙️",
  },
  {
    title: "Comprehensive Analytics",
    description:
      "Track performance with detailed analytics, helping you optimize your workforce management strategies.",
    icon: "📊",
  },
  {
    title: "AI-Powered Free-Text Input",
    description:
      "Simply describe your scheduling needs in plain language, and our AI does the rest.",
    icon: "🤖",
  },
  {
    title: "Real-Time Adjustments",
    description:
      "Easily adapt to last-minute changes like absences or increased demand, with seamless updates.",
    icon: "⏱️",
  },
  {
    title: "Boost Employee Satisfaction",
    description:
      "Improve morale by aligning shifts with employee preferences and reducing burnout.",
    icon: "😊",
  },
  {
    title: "Save Time and Costs",
    description:
      "Eliminate manual scheduling errors, saving you hours of work and operational costs.",
    icon: "💰",
  },
];
export const LearnMore = () => {
  return (
    <section className="bg-gradient-to-b from-white to-[#D2DCFF] py-24">
      <div className="container lg:mx-auto ">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center text-3xl lg:text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001e80] text-transparent bg-clip-text">
            Smart Shift Management System - ScheduliQ
          </div>
          <p className="text-center text-[20px] leading-[30px] tracking-tight text-[#010D3E] mt-6">
            ScheduliQ transforms the way businesses handle scheduling. With an
            advanced algorithm, it creates efficient and fair schedules in
            minutes. Seamlessly integrated AI allows managers to input requests
            in free text, making scheduling faster and easier than ever before.
            The system dynamically adjusts schedules in real-time to handle
            changes like absences or increased demand, ensuring smooth
            operations.
          </p>
        </div>
        <Image src={heropic} alt="hero-pic" className="mt-10" />
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center text-3xl lg:text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001e80] text-transparent bg-clip-text">
            Who Is It For?
          </div>
          <p className="text-center text-[20px] leading-[30px] tracking-tight text-[#010D3E] mt-6">
            Whether you run a bustling restaurant, manage a retail chain, or
            oversee a hospital unit, ScheduliQ is your perfect scheduling
            partner. Designed to meet the needs of businesses big or small, our
            system makes scheduling seamless for managers while giving employees
            control and clarity over their shifts.
          </p>
        </div>
        <section>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="text-center text-3xl lg:text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001e80] text-transparent bg-clip-text">
              Why Choose ScheduliQ?
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-lg border hover:shadow-2xl transform transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full mb-4">
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};
