import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Ballu Admin",
  description: "Admin panel for Ballu Jewellers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex bg-[#0a0806] text-[#e5e5e0]">
        <Providers>
          <AuthGuard>{children}</AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
