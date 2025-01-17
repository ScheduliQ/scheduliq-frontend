import Image from "next/image";
import heropic from "../assets/heropic.png";
export const LearnMore = () => {
  return (
    <section className="bg-gradient-to-b from-white to-[#D2DCFF] py-24">
      <div className="container">
        <div className="text-center text-3xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001e80] text-transparent bg-clip-text">
          Smart Shift Management System - ScheduliQ
        </div>
        <p className="text-center text-[20px] leading-[30px] tracking-tight text-[#010D3E] mt-6">
          ScheduliQ is an innovative platform for managing work schedules,
          providing a smart, fast, and dynamic solution for team managers and
          employees across all industries. The system leverages advanced
          algorithms and artificial intelligence (AI) to assign shifts fairly
          and efficiently, taking into account constraints such as employee
          availability, personal preferences, and wage considerations.
        </p>
        <Image src={heropic} alt="hero-pic" className="mt-10" />
      </div>
    </section>
  );
};
