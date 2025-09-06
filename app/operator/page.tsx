// app/operator/page.tsx
import dynamic from "next/dynamic";

const OperatorPageClient = dynamic(
  () => import("./components/OperatorPageClient")
);

export default function OperatorPage() {
  return <OperatorPageClient />;
}
