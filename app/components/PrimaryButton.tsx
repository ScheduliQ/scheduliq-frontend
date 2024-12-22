import Link from "next/link";

interface PrimaryButtonProps {
  label: string;
  href: string;
}

export default function PrimaryButton({ label, href }: PrimaryButtonProps) {
  return (
    <Link href={href}>
      <button className="whitespace-nowrap rounded-full bg-[#014DAE] px-8 py-3 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#012F70]">
        {label}
      </button>
    </Link>
  );
}
