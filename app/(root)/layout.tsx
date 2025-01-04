import BackgroundAnimation from "../components/BackgroundAnimation";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative font-work-sans min-h-screen overflow-hidden">
      {/* רכיב הרקע האנימטיבי */}
      <BackgroundAnimation />

      {/* התוכן של הדף */}
      <div className="relative z-10">{children}</div>
    </main>
  );
}
