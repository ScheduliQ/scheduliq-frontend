import DynamicBackground from "../../components/DynamicBackground";
import Navbar from "../components/Navbar";

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Navbar */}
      <div className="relative flex-1 flex items-center justify-center">
        <Navbar />
      </div>

      {/* עטיפת הרקע והתוכן */}
      <div className="relative flex-1 flex items-center justify-center">
        {/* רקע דינמי */}
        <div className="absolute inset-0 -z-10">
          <DynamicBackground />
        </div>

        {/* תוכן הטופס */}
        <div className="relative z-10 w-full max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
