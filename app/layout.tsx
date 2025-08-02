import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

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
      <Head>
        {/* Favicons */}
        <link
          href="https://placehold.co/32x32/4154f1/ffffff?text=M"
          rel="icon"
        />
        <link
          href="https://placehold.co/180x180/4154f1/ffffff?text=M"
          rel="apple-touch-icon"
        />

        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Vendor CSS Files */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
          rel="stylesheet"
        />

        {/* Custom CSS */}
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/index.css" />
      </Head>
      <body className={`${inter.variable}`}>{children}</body>
    </html>
  );
}
