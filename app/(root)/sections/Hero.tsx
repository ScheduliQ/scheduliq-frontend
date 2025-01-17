import Image from "next/image";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import calendar from "../assets/cal1.png";

export const Hero = () => {
  return (
    <section className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_66%)] md:ovreflow-x-clip">
      <div className="h-28"> </div>
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001e80] text-transparent bg-clip-text">
              Effortless Scheduling with ScheduliQ!
            </h1>
            <p className="text-xl text-[#010D3E] tracking-tight mt-6">
              Smart, efficient, and tailored to your needs.
            </p>
            <div className="flex gap-1 items-center mt-[30px]">
              <PrimaryButton label="Get Started" href="/login" />
              <SecondaryButton label="Learn More" href="/learn-more" />
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <Image
              src={calendar}
              alt="calendar image"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
