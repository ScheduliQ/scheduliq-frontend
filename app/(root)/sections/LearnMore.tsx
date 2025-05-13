"use client";
import Image from "next/image";
import heropic from "../assets/heropic.png";
import macMock from "../assets/macmock.png";
import chatImg from "../assets/chat.jpeg";
import shiftassImg from "../assets/shiftass.jpeg";
import { motion } from "framer-motion";
import {
  Monitor,
  Smartphone,
  Users,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  Play,
  Zap,
  MessageSquare,
  Keyboard,
  HeartHandshake,
} from "lucide-react";
import { useState, useRef } from "react";

export const LearnMore = () => {
  // Feature cards with icons
  const features = [
    {
      title: "Instant, Optimized Schedules",
      description:
        "Generate efficient, compliant, and balanced shift schedules within seconds, dramatically reducing manual effort.",
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      delay: 0.1,
    },
    {
      title: "Smart AI Assistant",
      description:
        "Our intelligent chatbot helps managers with insightful suggestions and guidance. Ask questions about team availability, shift constraints, or optimal staffing strategies, and get clear, helpful answers instantly.",
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
      delay: 0.2,
    },
    {
      title: "Natural Constraint Processing",
      description:
        "Employees can easily submit their preferences and availability in everyday language—ScheduliQ automatically interprets and integrates these constraints into the scheduling process.",
      icon: <Keyboard className="w-6 h-6 text-blue-600" />,
      delay: 0.3,
    },
    {
      title: "Happier, More Engaged Teams",
      description:
        "By respecting preferences, minimizing burnout, and promoting fairness, ScheduliQ significantly enhances employee satisfaction and retention.",
      icon: <HeartHandshake className="w-6 h-6 text-blue-600" />,
      delay: 0.4,
    },
  ];

  // Alternating sections data
  const alternatingContent = [
    {
      title: "Seamless Team Coordination",
      description:
        "Instantly update your entire workforce. ScheduliQ ensures every team member stays informed about shifts, changes, and important announcements, so your workplace runs smoothly and efficiently—no more missed updates.",
      image: chatImg,
      imageAlt: "Seamless Team Coordination",
      points: [
        "Real-time shift alerts and reminders",
        "Immediate shift swap notifications",
      ],
    },
    {
      title: "Flexible, Intelligent Scheduling",
      description:
        "Build schedules effortlessly and intuitively. ScheduliQ quickly generates optimized shift rosters that meet employee preferences and business needs, allowing easy adjustments on the fly.",
      image: shiftassImg,
      imageAlt: "Workforce Analytics Dashboard",
      points: [
        "Quick one-click schedule creation",
        "Intuitive drag-and-drop editing",
        "Detailed shortages view.",
      ],
    },
  ];

  // Support options
  const supportOptions = [
    {
      title: "Email Support",
      description:
        "Reach out for detailed help on advanced topics and custom scheduling requests.",
      icon: "✉️",
    },
  ];

  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: custom,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main heading section */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeInUpVariant}
          custom={0}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-br from-black to-[#001e80] text-transparent bg-clip-text mb-6">
            One-Click Schedule Generation
          </h2>
          <p className="text-lg text-[#010D3E] leading-relaxed">
            With a single click on{" "}
            <span className="relative inline-block">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0055b8] to-[#7400e0]">
                Generate
              </span>{" "}
            </span>
            , ScheduliQ's intelligent engine delivers a complete shift roster in
            seconds. All your constraints—from staff availability and role
            preferences to compliance requirements—are seamlessly integrated
            into a ready-to-edit schedule. Simply drag-and-drop team members,
            tweak hours or roles, and export or publish your optimized roster
            without ever opening a spreadsheet.
          </p>
        </motion.div>

        {/* Video Display with Custom Mockup */}
        <div className="relative mb-20 md:mb-28">
          <div className="  p-6 md:p-10">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-4xl mx-auto">
                {/* Custom Browser/App Window Mock */}
                <div className="overflow-hidden rounded-xl shadow-2xl border border-gray-200">
                  {/* Window Header Bar */}
                  <div className="h-8 bg-gray-800 flex items-center px-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-gray-400 text-xs mx-auto font-mono">
                      ScheduliQ Dashboard
                    </div>
                  </div>

                  {/* Video Container */}
                  <div className="bg-black aspect-video">
                    <video
                      className="w-full h-full object-contain"
                      src="/assets/ourv.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls={false}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternating sections */}
        <div className="space-y-24 mb-24">
          {alternatingContent.map((content, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-8 lg:gap-16`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeInUpVariant}
              custom={0.2}
            >
              {/* Image side */}
              <div className="w-full lg:w-1/2">
                {/* Window style wrapper */}
                <div className="overflow-hidden rounded-xl shadow-xl border border-gray-200">
                  {/* Window Header Bar */}
                  <div className="h-8 bg-gray-800 flex items-center px-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-gray-400 text-xs mx-auto font-mono">
                      {content.imageAlt}
                    </div>
                  </div>

                  {/* Image container */}
                  <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-0">
                    <Image
                      src={content.image}
                      alt={content.imageAlt}
                      className="w-full h-auto object-cover"
                      width={800}
                      height={500}
                    />
                  </div>
                </div>
              </div>

              {/* Content side */}
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold text-[#001e80] mb-4">
                  {content.title}
                </h3>
                <p className="text-gray-700 mb-6">{content.description}</p>
                <ul className="space-y-2">
                  {content.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Who Is It For section */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeInUpVariant}
          custom={0.1}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-black to-[#001e80] text-transparent bg-clip-text mb-6">
            Who Is It For?
          </h2>
          <p className="text-lg text-[#010D3E] leading-relaxed">
            ScheduliQ is designed for any organization aiming to simplify and
            modernize its shift scheduling. Whether you're running a busy café,
            managing a retail store, coordinating hospital staff, or supervising
            customer support teams—ScheduliQ streamlines the scheduling process,
            giving managers effortless control and employees greater flexibility
            and clarity.
          </p>
        </motion.div>

        {/* Features grid - now more compact */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center tracking-tight bg-gradient-to-br from-black to-[#001e80] text-transparent bg-clip-text mb-12">
            Why Choose ScheduliQ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeInUpVariant}
                custom={feature.delay}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Support options */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#001e80] mb-4">
              World-Class Support
            </h2>
            <p className="text-[#010D3E]">
              Our team is with you every step of the way to ensure your
              scheduling success.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
            {supportOptions.map((option, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <div className="text-4xl mb-4">{option.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
