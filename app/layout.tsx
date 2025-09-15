// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Script from "next/script";
import { DarkModeProvider } from "@/providers/DarkThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MedMapp paneli",
  description: "MedMapp hamma uchun birdek",
  icons: {
    icon: "https://placehold.co/32x32/012970/ffffff?text=M",
    apple: "https://placehold.co/180x180/012970/ffffff?text=M",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}`}>
        <DarkModeProvider>
          <QueryProvider>{children}</QueryProvider>
        </DarkModeProvider>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        />
        <Script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js" />
      </body>
    </html>
  );
}
