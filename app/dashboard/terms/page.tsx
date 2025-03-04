"use client";
import Navbar from "../components/Navbar";
import DynamicBackground from "../../components/DynamicBackground";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="py-2 h-screen w-screen overflow-x-hidden flex flex-col">
      {/* עטיפת הרקע והתוכן */}
      <div className="py-7 relative flex-1 flex items-center justify-center px-6">
        {/* תוכן ה-Terms of Service */}
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
            Terms of Service
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
                These Terms of Service outline the rules and regulations for
                using our smart shift scheduling system.
              </p>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                2. User Responsibilities
              </h2>
              <p>By using ScheduliQ, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and truthful information.</li>
                <li>Use the platform only for lawful purposes.</li>
                <li>Respect the privacy and rights of other users.</li>
              </ul>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                3. Account Security
              </h2>
              <p>
                As a user, you are responsible for maintaining the security of
                your account.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Do not share your login credentials with anyone.</li>
                <li>Report any unauthorized activity immediately.</li>
              </ul>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                4. Prohibited Activities
              </h2>
              <p>Users are prohibited from:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hacking or attempting to breach security.</li>
                <li>Using automated scripts to access the system.</li>
                <li>
                  Engaging in any activity that disrupts platform operations.
                </li>
              </ul>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                5. Data Usage
              </h2>
              <p>
                We collect and process data in accordance with our
                <Link
                  href="/dashboard/privacy-policy"
                  className="text-blue-700 hover:underline"
                >
                  {" "}
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                6. Service Availability
              </h2>
              <p>
                We strive to ensure continuous service but do not guarantee
                uptime.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We may suspend services for maintenance.</li>
                <li>We are not liable for any downtime or data loss.</li>
              </ul>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                7. Changes to Terms
              </h2>
              <p>
                ScheduliQ reserves the right to modify these Terms of Service at
                any time.
              </p>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                8. Termination of Service
              </h2>
              <p>
                We may terminate or suspend accounts if users violate these
                terms.
              </p>
            </section>

            <section className="border-l-4 border-blue-700 pl-4">
              <h2 className="text-xl font-semibold text-gray-900">
                9. Contact Us
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
