import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" backdrop-blur py-3 text-center">
      <div className="text-sm text-gray-600">
        <Link href="/dashboard/terms" className="mx-2 hover:underline">
          Terms of Service
        </Link>
        <Link href="/dashboard/contact" className="mx-2 hover:underline">
          Contact Us
        </Link>
        <Link href="/dashboard/privacy-policy" className="mx-2 hover:underline">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
