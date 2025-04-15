"use client";

import React, { useState, useRef, useEffect, CSSProperties } from "react";

interface InfoButtonProps {
  infoText: string;
}

const InfoButton: React.FC<InfoButtonProps> = ({ infoText }) => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties>({});

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Adjust tooltip horizontal position when visible
  useEffect(() => {
    if (visible && containerRef.current && tooltipRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const gap = 10; // space from viewport edge
      let style: CSSProperties = {
        top: "100%",
        transform: "translateX(-50%)",
        marginTop: "0.5rem",
      };

      // Check if tooltip exceeds the right boundary
      if (
        containerRect.left + tooltipRect.width / 2 >
        window.innerWidth - gap
      ) {
        style = {
          top: "100%",
          left: "auto",
          right: 0,
          transform: "none",
          marginTop: "0.5rem",
        };
      }
      // Check if tooltip exceeds the left boundary
      if (containerRect.left - tooltipRect.width / 2 < gap) {
        style = {
          top: "100%",
          left: 0,
          right: "auto",
          transform: "none",
          marginTop: "0.5rem",
        };
      }
      setTooltipStyle(style);
    }
  }, [visible]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        onClick={() => setVisible(!visible)}
        className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="More information"
      >
        <svg
          className="w-8 h-8"
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
          className="absolute z-[9999] p-3 bg-gray-700 text-white text-xs rounded-md shadow-md mt-2 min-w-[200px] max-w-lg"
          style={{ whiteSpace: "normal", ...tooltipStyle }}
        >
          {infoText}
        </div>
      )}
    </div>
  );
};

export default InfoButton;
