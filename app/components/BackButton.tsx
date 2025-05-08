"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = "" }) => {
  const router = useRouter();

  const handleBackNavigation = () => {
    // Navigate directly to the main dashboard
    router.push("/dashboard");
  };

  return (
    <button
      onClick={handleBackNavigation}
      className={`font-sans flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium py-1.5 px-3 rounded-lg hover:bg-blue-50 ${className}`}
      aria-label="Back to Dashboard"
    >
      <IoArrowBack className="text-lg" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
