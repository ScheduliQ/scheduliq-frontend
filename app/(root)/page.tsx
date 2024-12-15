import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-10">
      {/* Left & Right Centered */}
      <div className="flex w-full items-center justify-between max-w-7xl">
        {/* Left Side */}
        <div className="w-1/2 flex flex-col justify-center space-y-6">
          <Image
            src="/logo.png"
            alt="logo"
            width={350}
            height={200}
            className="ml-20"
          />
          <p className="text-lg text-gray-600 leading-relaxed">
            ScheduliQ is a smart system for managing work schedules and shifts,
            designed to provide an efficient and automated solution for team
            managers and employees.
          </p>

          <div className="flex space-x-4">
            <Link href="/login">
              <button className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-600">
                Get Started
              </button>
            </Link>
            <Link href="/learn-more">
              <button className="px-6 py-3 bg-gray-300 text-black text-lg font-semibold rounded-md hover:bg-gray-400">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 flex items-center justify-center">
          <Image
            src="/hand.png"
            alt="illustration"
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>
      </div>
    </main>
  );
}
