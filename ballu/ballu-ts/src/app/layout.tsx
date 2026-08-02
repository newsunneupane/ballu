import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoldTicker from "@/components/layout/GoldTicker";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QueryProvider from "@/components/QueryProvider";
import ThemeProvider from "@/components/layout/ThemeProvider";

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
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('bj-theme');
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen" style={{ background: 'var(--bj-bg)', color: 'var(--bj-text-body)' }}>
        <QueryProvider>
          <ThemeProvider>
            <GoldTicker />
            <header className="w-full">
              <Navbar />
            </header>
            <main className="relative pt-[56px] md:pt-[68px]">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}