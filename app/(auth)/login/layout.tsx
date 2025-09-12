import type { Metadata } from "next";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./layout.css";

export const metadata: Metadata = {
  title: "MedMapp Kirish | Ro'yxatdan o'tish",
  description: "MedMapp tizimiga kirish yoki ro'yxatdan o'tish",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-wrapper bg-[linear-gradient(to_right,#e9f0f8_0%,#5c99f4_100%)]">
      <div id="toast-container"></div>
      <div className="auth-card">{children}</div>
    </div>
  );
}
