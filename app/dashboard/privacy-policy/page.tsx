"use client";
import Navbar from "../components/Navbar";
import DynamicBackground from "../../components/DynamicBackground";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="py-2 h-screen w-screen overflow-x-hidden flex flex-col">
      <div className="relative flex-1 flex items-center justify-center">
        <Navbar />
      </div>

      {/* עטיפת הרקע והתוכן */}
      <div className="py-7 relative flex-1 flex items-center justify-center px-6">
        {/* רקע דינמי */}
        <div className="absolute inset-0 -z-10">
          <DynamicBackground />
        </div>

        {/* תוכן ה-Privacy Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/20 p-10 rounded-3xl w-full max-w-5xl md:max-w-6xl lg:max-w-7xl shadow-2xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-extrabold text-center text-gray-900 tracking-wide uppercase"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-800 text-sm mt-2 text-center italic"
          >
            Last Updated: February 2025
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 space-y-8 text-gray-800 text-base leading-relaxed"
          >
            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                1. Introduction
              </h2>
              <p>
                Welcome to{" "}
                <span className="text-blue-700 font-semibold">ScheduliQ</span>!
                This Privacy Policy explains how we collect, use, and protect
                your personal data when using our smart shift scheduling system.
              </p>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                2. Information We Collect
              </h2>
              <p>We collect the following types of data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-blue-700">Personal Data:</strong>{" "}
                  Name, email, job role.
                </li>
                <li>
                  <strong className="text-blue-700">Work Preferences:</strong>{" "}
                  Availability, shift preferences.
                </li>
                <li>
                  <strong className="text-blue-700">System Logs:</strong> User
                  interactions with the platform.
                </li>
              </ul>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                3. How We Use Your Data
              </h2>
              <p>Your information is used to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Efficiently schedule shifts.</li>
                <li>Improve system recommendations.</li>
                <li>Ensure fair shift distribution.</li>
              </ul>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                4. Data Security
              </h2>
              <p>
                We implement industry-standard security measures to protect your
                data from unauthorized access.
              </p>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                5. Third-Party Services
              </h2>
              <p>
                We use AI-powered tools such as the{" "}
                <span className="text-blue-700">GPT API</span> for natural
                language shift management, but we do not share your personal
                data with third-party services.
              </p>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                6. Your Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request access to your data.</li>
                <li>
                  Request correction or deletion of your personal information.
                </li>
              </ul>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                7. Contact Us
              </h2>
              <p>
                If you have any questions, feel free to contact us at{" "}
                <a
                  href="mailto:support@scheduliq.com"
                  className="text-blue-700 hover:underline"
                >
                  support@scheduliq.com
                </a>
                .
              </p>
            </section>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
