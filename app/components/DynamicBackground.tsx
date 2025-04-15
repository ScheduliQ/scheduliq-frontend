// app/components/DynamicBackground.tsx
import React from "react";
import "./DynamicBackground.css";

export default function DynamicBackground() {
  return (
    <ul className="background">
      {Array.from({ length: 16 }).map((_, index) => (
        <li key={index}></li>
      ))}
    </ul>
  );
}
