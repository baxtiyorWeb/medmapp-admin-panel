import { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./../globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Script from "next/script";
import "./layout.css";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MedMapp Login | Register",
  description: "MedMapp hamma uchun birdek ",
};

const AuthLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className={`${inter.variable}`}>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        strategy="beforeInteractive"
      />
      <Script src="https://unpkg.com/imask" strategy="beforeInteractive" />
      {children}
    </div>
  );
};

export default AuthLayout;
