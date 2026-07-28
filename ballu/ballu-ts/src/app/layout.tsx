import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoldTicker from "@/components/layout/GoldTicker";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ballu Jewellers",
  description: "Heirloom jewellery crafted for a quieter wear. Three generations of artistry from a single bench in the heart of the city.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-black text-white min-h-screen">
        <GoldTicker />
        <header className="w-full">
          <Navbar />
        </header>
        <main className="relative pt-[56px] md:pt-[68px]">
          {children}
        </main>
      </body>
    </html>
  );
}