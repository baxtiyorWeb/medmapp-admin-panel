import "./layout.css";
import Script from "next/script";

export default function OperatorLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="uz">
      <head>
        <link
          rel="icon"
          href="https://placehold.co/32x32/012970/ffffff?text=M"
        />
        <link
          rel="apple-touch-icon"
          href="https://placehold.co/180x180/012970/ffffff?text=M"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </head>

      <body>
        {children}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        />
        <Script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js" />
      </body>
    </html>
  );
}
