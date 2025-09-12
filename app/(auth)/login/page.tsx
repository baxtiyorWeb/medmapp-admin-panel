
"use client";
import dynamic from "next/dynamic";

const LoginClientComponent = dynamic(
  () => import("@/components/LoginClientComponent"),
  { ssr: false }
);

export default function LoginPage() {
  return <LoginClientComponent />;
}
