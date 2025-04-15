import Link from "next/link";

interface SecondaryButtonProps {
  label: string;
  href?: string; // Make href optional
  onClick?: () => void; // Optional onClick prop
}

export default function SecondaryButton({
  label,
  href,
  onClick,
}: SecondaryButtonProps) {
  return href ? (
    <Link href={href}>
      <button
        className="px-6 py-3 rounded-lg text-[#014DAE] font-sans bg-white border border-[#014DAE] transition-colors duration-200 hover:bg-[#F0F5FF] hover:border-[#014DAE] hover:text-[#014DAE] active:bg-[#014DAE] active:text-white focus:outline-none disabled:bg-blue-200 disabled:text-blue-300 disabled:border-blue-200 disabled:cursor-not-allowed"
        onClick={onClick}
      >
        {label}
      </button>
    </Link>
  ) : (
    <button
      className="px-6 py-3 rounded-lg text-[#014DAE] font-sans bg-white border border-[#014DAE] transition-colors duration-200 hover:bg-[#F0F5FF] hover:border-[#014DAE] hover:text-[#014DAE] active:bg-[#014DAE] active:text-white focus:outline-none disabled:bg-blue-200 disabled:text-blue-300 disabled:border-blue-200 disabled:cursor-not-allowed"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
