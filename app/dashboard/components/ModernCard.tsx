import React, { ReactNode } from "react";

interface ModernCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}

const ModernCard: React.FC<ModernCardProps> = ({
  title,
  children,
  className = "",
  headerClassName = "",
}) => {
  return (
    <div className={`w-full border border-blue-600  bg-white ${className}`}>
      {/* Header */}
      <div
        className={`px-6 py-4 bg-gradient-to-r from-blue-600  via-blue-500 to-indigo-500 text-white font-medium ${headerClassName}`}
      >
        {title}
      </div>

      {/* Content */}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default ModernCard;
