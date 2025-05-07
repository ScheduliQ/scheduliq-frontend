"use client";

import React, { useState, useRef, useEffect } from "react";

interface InfoButtonProps {
  infoText: string;
}

const InfoButton: React.FC<InfoButtonProps> = ({ infoText }) => {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setVisible(!visible)}
        className="ml-1 text-gray-400 focus:outline-none"
        aria-label="More information"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M12 12h.01"
          />
        </svg>
      </button>
      {visible && (
        <div
          ref={tooltipRef}
          className="absolute z-[9999] p-3 bg-gray-800/95 backdrop-blur-sm text-white text-sm rounded-lg shadow-lg min-w-[200px] max-w-lg right-0 mt-2"
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          {infoText}
        </div>
      )}
    </div>
  );
};

export default InfoButton;
