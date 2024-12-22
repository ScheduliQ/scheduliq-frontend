import Image from "next/image";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-landing bg-cover bg-center">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left section */}
          <div className="pl-20 w-full lg:w-[35%] flex flex-col items-center justify-center px-4">
            <Image
              src="/logo.png"
              alt="logo"
              width={550}
              height={350}
              className="w-full max-w-[400px]"
              priority
            />
            <p className="font-sans font-bold text-2xl text-[#666666] text-center mt-6 ">
              Effortless Scheduling with ScheduliQ!
            </p>
            <p className="font-sans text-lg text-[#666666] text-center  mb-8">
              Smart, efficient, and tailored to your needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <PrimaryButton label="Get Started" href="/login" />
              <SecondaryButton label="Learn More" href="/learn-more" />
            </div>
          </div>

          {/* Right section */}
          <div className="pt-10 pl-20 w-full lg:w-[57%] flex items-center justify-center mt-8 lg:mt-0">
            <div className="relative w-full">
              <Image
                src="/hero-pic.png"
                alt="illustration"
                width={1200}
                height={1200}
                className="rounded-lg w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
