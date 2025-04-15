import Link from "next/link";

interface MainColorButtonProps {
  label: string;
  href?: string; // Optional href for navigation
  onClick?: () => void; // Optional onClick handler
}

export default function MainColorButton({
  label,
  href,
  onClick,
}: MainColorButtonProps) {
  return href ? (
    <Link href={href}>
      <button
        className="px-6 py-3 rounded-lg text-white font-sans bg-[#014DAE] border border-transparent transition-colors duration-200 hover:bg-[#013C85] active:bg-white active:text-[#014DAE] active:border-[#014DAE] focus:outline-none disabled:bg-blue-200 disabled:text-blue-300 disabled:cursor-not-allowed"
        onClick={onClick}
      >
        {label}
      </button>
    </Link>
  ) : (
    <button
      className="px-6 py-3 rounded-lg text-white font-sans bg-[#014DAE] border border-transparent transition-colors duration-200 hover:bg-[#013C85] active:bg-white active:text-[#014DAE] active:border-[#014DAE] focus:outline-none disabled:bg-blue-200 disabled:text-blue-300 disabled:cursor-not-allowed"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
