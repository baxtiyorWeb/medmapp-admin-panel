import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "My App",
  description: "Next.js app with Inter font",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicons */}
        <link
          href="https://placehold.co/32x32/3a86ff/ffffff?text=✈"
          rel="icon"
        />
        <link
          href="https://placehold.co/180x180/3a86ff/ffffff?text=✈"
          rel="apple-touch-icon"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        ></link>
      </head>
      <body className={`${inter.variable}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
