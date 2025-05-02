"use client";
import Image from "next/image";
import heropic from "../assets/heropic.png";
import { motion } from "framer-motion";
import {
  Monitor,
  Smartphone,
  Users,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

export const LearnMore = () => {
  // Feature cards with icons
  const features = [
    {
      title: "Smart Scheduling Algorithm",
      description:
        "Automates shift assignments in seconds, ensuring optimal efficiency and fairness for your workforce.",
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      delay: 0.1,
    },
    {
      title: "AI-Powered Input",
      description:
        "Describe your scheduling needs in plain language, and our AI automatically creates the perfect schedule.",
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      delay: 0.2,
    },
    {
      title: "Real-Time Adjustments",
      description:
        "Easily adapt to last-minute changes like absences or increased demand with seamless updates.",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      delay: 0.3,
    },
    {
      title: "Employee Satisfaction",
      description:
        "Improve morale by aligning shifts with preferences while reducing burnout and improving retention.",
      icon: <Award className="w-6 h-6 text-blue-600" />,
      delay: 0.4,
    },
  ];

  // Alternating sections data
  const alternatingContent = [
    {
      title: "Intelligent Shift Management",
      description:
        "Our AI-driven scheduling engine analyzes your workforce needs and creates optimized schedules that balance employee preferences, business requirements, and compliance rules. Managers save hours per week with automated scheduling that reduces conflicts and improves satisfaction.",
      image: heropic,
      imageAlt: "Intelligent Shift Management",
      points: [
        "Reduced scheduling time by 85%",
        "Balances workload fairly among team",
        "Considers employee preferences",
      ],
    },
    {
      title: "Real-Time Workforce Insights",
      description:
        "Get complete visibility into your workforce with real-time analytics. Track attendance, monitor shift swaps, identify productivity patterns, and make data-driven decisions to improve your operations and reduce costs.",
      image: heropic,
      imageAlt: "Workforce Analytics Dashboard",
      points: [
        "Dynamic reporting dashboard",
        "Attendance and productivity tracking",
        "Cost optimization insights",
      ],
    },
    {
      title: "Seamless Communication",
      description:
        "Keep your entire team informed with built-in notifications. Employees get instant updates about schedule changes, shift opportunities, and urgent messages directly through the app, reducing confusion and improving coordination.",
      image: heropic,
      imageAlt: "Mobile Communication Features",
      points: [
        "Instant notification system",
        "Group and individual messaging",
        "Shift change alerts",
      ],
    },
  ];

  // Support options
  const supportOptions = [
    {
      title: "24/7 Live Chat",
      description:
        "Get real-time assistance from our team, anytime you need help with your scheduling.",
      icon: "💬",
    },
    {
      title: "Knowledge Base",
      description:
        "Access our comprehensive library of tutorials, FAQs, and troubleshooting guides.",
      icon: "📚",
    },
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
            Smart Shift Management System
          </h2>
          <p className="text-lg text-[#010D3E] leading-relaxed">
            ScheduliQ transforms workforce management with an advanced
            AI-powered system that creates efficient and fair schedules in
            minutes. No more spreadsheets or manual calculations — our
            intelligent platform makes workforce scheduling faster and more
            accurate than ever before.
          </p>
        </motion.div>

        {/* Device mockups section */}
        <motion.div
          className="relative mb-20 md:mb-28"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-10 shadow-lg">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Mock Desktop App - SMALLER SIZE */}
              <div className="w-full lg:w-3/5 relative mx-auto max-w-2xl">
                <div className="rounded-xl overflow-hidden shadow-2xl border-8 border-gray-800 bg-gray-800">
                  <Image
                    src={heropic}
                    alt="ScheduliQ Dashboard"
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-blue-100 p-4 rounded-lg shadow-lg transform rotate-3">
                  <p className="text-blue-800 font-medium">
                    Coming soon: Interactive demo
                  </p>
                </div>
              </div>

              {/* Mock Mobile App */}
              <div className="w-full lg:w-1/3 flex justify-center">
                <div className="relative w-[180px] h-[360px] border-[14px] border-black rounded-[36px] shadow-xl bg-white overflow-hidden">
                  <div className="absolute top-0 w-[40%] h-[30px] bg-black left-1/2 transform -translate-x-1/2 rounded-b-xl"></div>
                  <Image
                    src={heropic}
                    alt="ScheduliQ Mobile App"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <p className="text-blue-800 font-medium text-lg">
                Experience ScheduliQ across all your devices
              </p>
            </div>
          </div>
        </motion.div>

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
                <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-5 rounded-xl shadow-md">
                  <Image
                    src={content.image}
                    alt={content.imageAlt}
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
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
            Whether you run a bustling restaurant, manage a retail chain,
            oversee a hospital unit, or coordinate a customer service team,
            ScheduliQ is your perfect scheduling partner. Our system makes
            scheduling seamless for managers while giving employees better
            control and clarity over their shifts.
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
