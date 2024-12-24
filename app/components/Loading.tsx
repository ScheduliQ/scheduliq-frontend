import Image from "next/image";

export default function Loading() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/90 rounded-lg shadow-lg p-8 flex flex-col items-center">
      {/* Coffee Image */}
      <Image
        src="/coffee.png" // Path to image inside the public folder
        alt="Coffee illustration"
        width={150}
        height={150}
        className="mb-4"
      />
      {/* Text below the image */}
      <p className="text-gray-600 text-center font-sans text-lg">
        <span className="font-bold">Loading...</span> <br />
        How about a coffee pic while you wait?
      </p>
    </div>
  );
}
