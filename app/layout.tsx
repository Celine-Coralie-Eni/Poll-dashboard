import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster, ToasterProvider } from "@/components/Toaster";
import { TolgeeAppProvider } from "@/lib/tolgee-optimized";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Poll Dashboard",
  description: "Create and manage polls with real-time results",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${inter.variable}`}>
        <SessionProvider>
          <TolgeeAppProvider>
            <ThemeProvider>
              <ToasterProvider>
                <div className="min-h-screen bg-base-100">
                  {children}
                  <Toaster />
                </div>
              </ToasterProvider>
            </ThemeProvider>
          </TolgeeAppProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
 