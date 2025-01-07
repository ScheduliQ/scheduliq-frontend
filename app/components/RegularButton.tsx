import Link from "next/link";

interface RegularButtonProps {
  label: string;
  href?: string; // Optional href for navigation
  onClick?: () => void; // Optional onClick handler
}

export default function RegularButton({
  label,
  href,
  onClick,
}: RegularButtonProps) {
  return href ? (
    <Link href={href}>
      <button
        className="whitespace-nowrap rounded-md bg-[#F7FAFC] px-4 py-2 text-lg  text-[#014DAE] shadow-md transition-all duration-300 hover:bg-[#E2E8F0] hover:text-[#012F70] focus:outline-none focus:ring-2 focus:ring-[#014DAE] border border-[#014DAE] font-['Open_Sans']"
        onClick={onClick}
      >
        {label}
      </button>
    </Link>
  ) : (
    <button
      className="whitespace-nowrap rounded-md bg-[#F7FAFC] px-4 py-2 text-lg  text-[#014DAE] shadow-md transition-all duration-300 hover:bg-[#E2E8F0] hover:text-[#012F70] focus:outline-none focus:ring-2 focus:ring-[#014DAE] border border-[#014DAE] font-['Open_Sans']"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
