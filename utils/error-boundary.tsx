import { Component, ReactNode } from "react";

// Error Boundary Component
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 dark:text-red-400 text-center p-4">
          Xatolik yuz berdi. Iltimos, sahifani yangilang yoki administrator
          bilan bog&apos;laning.
        </div>
      );
    }
    return this.props.children;
  }
}
