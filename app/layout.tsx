import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster, ToasterProvider } from "@/components/Toaster";
import { TolgeeAppProvider } from "@/lib/tolgee-optimized";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  title: "Poll Dashboard",
  description: "Create and manage polls with real-time results",
  keywords: ["polls", "voting", "surveys", "dashboard"],
  authors: [{ name: "PollVault Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} ${inter.variable}`}>
        <ErrorBoundary>
          <SessionProvider>
            <TolgeeAppProvider>
              <ThemeProvider>
                <ToasterProvider>
                  <div className="min-h-screen bg-base-100">
                    {children}
                    <Toaster />
                    <PerformanceMonitor />
                    <ServiceWorkerRegistration />
                  </div>
                </ToasterProvider>
              </ThemeProvider>
            </TolgeeAppProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
 