import Link from "next/link";

export default function SignupButton() {
  return (
    <Link href="/signup">
      <button className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all">
        Sign Up
      </button>
    </Link>
  );
}
