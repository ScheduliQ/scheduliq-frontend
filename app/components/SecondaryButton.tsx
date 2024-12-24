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
        className="whitespace-nowrap rounded-full bg-[#E6EDF7] px-8 py-3 text-lg font-semibold text-[#014DAE] shadow-md transition-all duration-300 hover:bg-[#85B4E1]"
        onClick={onClick}
      >
        {label}
      </button>
    </Link>
  ) : (
    <button
      className="whitespace-nowrap rounded-full bg-[#E6EDF7] px-8 py-3 text-lg font-semibold text-[#014DAE] shadow-md transition-all duration-300 hover:bg-[#85B4E1]"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
