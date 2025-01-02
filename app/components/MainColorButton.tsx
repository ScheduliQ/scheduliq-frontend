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
        className="whitespace-nowrap rounded-md bg-[#014DAE] px-4 py-2 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#012F70] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#014DAE] font-['Open_Sans']"
        onClick={onClick}
      >
        {label}
      </button>
    </Link>
  ) : (
    <button
      className="whitespace-nowrap rounded-md bg-[#014DAE] px-4 py-2 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#012F70] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#014DAE] font-['Open_Sans']"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
