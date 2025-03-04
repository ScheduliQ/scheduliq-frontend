import { useRouter } from "next/router";
import { FC, ReactNode, MouseEvent } from "react";

interface ModernButtonProps {
  children?: ReactNode;
  color?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  route?: string;
}

const ModernButton: FC<ModernButtonProps> = ({
  children = "Click Here",
  color = "#7C3AED",
  onClick,
  route,
}) => {
  // Initialize router only if route prop is provided
  const router = route ? useRouter() : null;

  const getLighterColor = (hex: string): string => {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const lighter = (color: number): number => Math.min(color + 20, 255);

    return `#${[r, g, b]
      .map(lighter)
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")}`;
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    if (onClick) {
      onClick(event);
    }
    if (route && router) {
      router.push(route);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={
        {
          "--button-color": color,
          "--button-hover-color": getLighterColor(color),
        } as React.CSSProperties
      }
      className="
        relative 
        px-8 
        py-3 
        text-white 
        font-sans
        font-medium
        transition-all 
        duration-300
        overflow-hidden
        group
        [background-color:var(--button-color)]
        hover:[background-color:var(--button-hover-color)]
        before:absolute
        before:content-['']
        before:bg-white
        before:h-full
        before:w-full
        before:opacity-20
        before:-translate-x-full
        before:transition-transform
        before:duration-300
        hover:before:translate-x-0
        before:top-0
        before:left-0
        after:absolute
        after:content-['']
        after:bg-white
        after:h-full
        after:w-full
        after:opacity-20
        after:translate-x-full
        after:transition-transform
        after:duration-300
        hover:after:-translate-x-0
        after:top-0
        after:left-0
      "
    >
      <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
        {children}
      </span>
    </button>
  );
};

export default ModernButton;
