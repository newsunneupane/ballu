import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import AuthGuard from "@/components/AuthGuard";
import QueryProvider from "@/components/QueryProvider";
import Toaster from "@/components/Toaster";

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
      <body className="min-h-full flex bg-[#faf8f4] text-[#26221d]">
        <QueryProvider>
          <Providers>
            <AuthGuard>{children}</AuthGuard>
          </Providers>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
