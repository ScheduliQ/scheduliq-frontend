import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" bg-white border-t py-3 text-center">
      <div className="text-sm text-gray-600">
        <div className="px-10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2025 ScheduliQ. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/dashboard/terms" className="mx-2 hover:underline">
              Terms of Service
            </Link>
            <Link href="/dashboard/contact" className="mx-2 hover:underline">
              Contact Us
            </Link>
            <Link
              href="/dashboard/privacy-policy"
              className="mx-2 hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
