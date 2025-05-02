"use client";
import Image from "next/image";
import { useState } from "react";
import Loading from "../../components/Loading";
import SecondaryButton from "../../components/SecondaryButton";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../../config/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // State for the login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // State for the forgot password modal
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  // Login functionality
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      // alert("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      if (err.message === "Firebase: Error (auth/invalid-credential).")
        setLoginError("Email or Password incorrect!");
      else setLoginError(err.message || "An unexpected error occurred.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Forgot Password functionality
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage("");
    setForgotError("");

    try {
      // setForgotLoading(true);
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotMessage("Password reset link has been sent to your email.");
    } catch (err: any) {
      if (err.code === "auth/invalid-email") {
        setForgotError("Invalid email format. Please check your input.");
      } else if (err.code === "auth/user-not-found") {
        setForgotError(
          "This email is not registered. Please check your input or sign up."
        );
      } else {
        setForgotError(
          "Failed to send password reset email. Please try again later."
        );
      }
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen  px-4 sm:px-6">
      {loginLoading && <Loading />}

      <div className="w-full  max-w-md relative">
        <div className=" rounded-2xl bg-[#f9fafb]  shadow-2xl overflow-hidden p-8 sm:p-10 border border-gray-100">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="logo"
              width={180}
              height={80}
              className="h-auto"
              priority
            />
          </div>

          {loginError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 rounded">
              <p className="text-red-500 text-sm">{loginError}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="block w-full px-4 py-4 bg-[#F3F6FA] border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#014DAE] focus:border-[#014DAE] peer placeholder-transparent transition-all duration-200"
                placeholder="Email Address"
                required
              />
              <label
                htmlFor="email"
                className="absolute text-xs font-medium text-gray-500 duration-150 transform -translate-y-3 bg-[#f9fafb] px-1 left-3 top-0 z-10 origin-[0] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:-translate-y-3 peer-focus:text-[#014DAE] peer-focus:text-xs peer-focus:bg-[#f9fafb] peer-focus:px-1 peer-focus:font-medium peer-focus:z-10"
              >
                Email Address
              </label>
            </div>

            <div className="relative">
              <input
                id="password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="block w-full px-4 py-4 bg-[#F3F6FA] border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#014DAE] focus:border-[#014DAE] peer placeholder-transparent transition-all duration-200"
                placeholder="Password"
                required
              />
              <label
                htmlFor="password"
                className="absolute text-xs font-medium text-gray-500 duration-150 transform -translate-y-3 bg-[#f9fafb] px-1 left-3 top-0 z-10 origin-[0] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:-translate-y-3 peer-focus:text-[#014DAE] peer-focus:text-xs peer-focus:bg-[#f9fafb] peer-focus:px-1 peer-focus:font-medium peer-focus:z-10"
              >
                Password
              </label>
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#014DAE] text-sm font-medium hover:text-[#012F70] transition-colors"
                onClick={() => setShowModal(true)}
              >
                Forgot?
              </button>
            </div>

            <button
              type="submit"
              className={`w-full px-6 py-3.5 text-white rounded-lg font-bold text-base transition-all duration-200 ${
                loginLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#014DAE] hover:bg-[#012F70] shadow-md hover:shadow-lg"
              }`}
              disabled={loginLoading}
            >
              {loginLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Reset Password
            </h3>

            {forgotMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-6 rounded">
                <p className="text-green-600 text-sm">{forgotMessage}</p>
              </div>
            )}

            {forgotError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 rounded">
                <p className="text-red-500 text-sm">{forgotError}</p>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="relative">
                <input
                  id="reset-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="block w-full px-4 py-4 bg-[#F3F6FA] border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#014DAE] focus:border-[#014DAE] peer placeholder-transparent transition-all duration-200"
                  placeholder="Email Address"
                  required
                />
                <label
                  htmlFor="reset-email"
                  className="absolute text-xs font-medium text-gray-500 duration-150 transform -translate-y-3 bg-[#f9fafb] px-1 left-3 top-0 z-10 origin-[0] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:-translate-y-3 peer-focus:text-[#014DAE] peer-focus:text-xs peer-focus:bg-[#f9fafb] peer-focus:px-1 peer-focus:font-medium peer-focus:z-10"
                >
                  Email Address
                </label>
              </div>

              <button
                type="submit"
                className={`w-full px-6 py-3 text-white font-bold rounded-lg transition-all duration-200 ${
                  forgotLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#014DAE] hover:bg-[#012F70] shadow-md hover:shadow-lg"
                }`}
                disabled={forgotLoading}
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 flex justify-end">
              <SecondaryButton
                label="Cancel"
                onClick={() => setShowModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
