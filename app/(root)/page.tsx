import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="flex items-center justify-between h-screen bg-gray-50 px-10">
      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-center space-y-6 ">
        {/* <h1 className="text-6xl font-extrabold text-gray-800 px-20">
          ScheduliQ
        </h1> */}
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
        <div className="flex space-x-4 ">
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
      <div className="w-1/2 h-full flex items-center justify-center">
        <Image
          src="/hand.png"
          alt="logo"
          width={3000}
          height={3000}
          className=""
        />
      </div>
    </main>
  );
}
