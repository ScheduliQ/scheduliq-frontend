import Lottie from "lottie-react";
import loadingAnimation from "../../public/animations/animated_coffee.json";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center rounded-xl justify-center bg-white/20 backdrop-blur-md">
      <div className="bg-none p-2 text-center flex flex-col items-center justify-center">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
          className="w-96 h-96 object-contain"
        />
        <p className="text-blue-950 font-medium text-xl -mt-24">
          How about a coffee animation while you wait?
        </p>
      </div>
    </div>
  );
}
