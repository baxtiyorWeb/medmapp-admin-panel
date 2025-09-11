"use client";
import dynamic from "next/dynamic";

const LoginClientComponent = dynamic(
  () => import("./../../components/LoginClientComponent"),
  { ssr: false } // serverda render qilinmaydi
);

export default function OperatorPage() {
  return <LoginClientComponent />;
}
