import Link from "next/link";

interface PrimaryButtonProps {
  label: string;
  href?: string; // Make href optional
  onClick?: () => void; // Optional onClick handler
}

export default function PrimaryButton({
  label,
  href,
  onClick,
}: PrimaryButtonProps) {
  return href ? (
    <Link href={href}>
      <button
        className="whitespace-nowrap rounded-xl bg-[#014DAE] px-8 py-3 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#012F70]"
        onClick={onClick}
      >
        {label}
      </button>
    </Link>
  ) : (
    <button
      className="whitespace-nowrap rounded-xl bg-[#014DAE] px-8 py-3 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#012F70]"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
