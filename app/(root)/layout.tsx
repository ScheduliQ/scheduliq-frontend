import Navbar from "../components/Navbar";
import DynamicBackground from "../components/DynamicBackground";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-work-sans ">
      <DynamicBackground />
      {children}
    </main>
  );
}
