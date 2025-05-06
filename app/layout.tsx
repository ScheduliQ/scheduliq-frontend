import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RoleProvider } from "../hooks/RoleContext"; // ייבוא ה-Provider

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ScheduliQ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RoleProvider>{children}</RoleProvider>
      </body>
    </html>
  );
}
//this is deploy test
