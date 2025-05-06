import Navbar from "../components/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main className="font-work-sans bg-[#f9fafb]">{children}</main>;
}
//this is CI test.
