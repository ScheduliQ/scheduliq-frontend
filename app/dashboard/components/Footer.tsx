import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" backdrop-blur py-3 text-center">
      <div className="text-sm text-gray-600">
        <a href="/terms" className="mx-2 hover:underline">
          Terms of Service
        </a>
        <Link href="/dashboard/contact" className="mx-2 hover:underline">
          Contact Us
        </Link>
        <a href="/privacy" className="mx-2 hover:underline">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
