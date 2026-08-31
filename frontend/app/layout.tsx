import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LLM Agents Workshop | Sacred Heart College",
  description:
    "LLM Agents — Concept, Tools and Applications. An inter-collegiate workshop on September 9, 2026 by the Department of Computer Applications (BCA), Sacred Heart College.",
  icons: {
    icon: "/department-logo.png",
    shortcut: "/department-logo.png",
    apple: "/department-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the inline script below sets data-theme on
    // <html> before React hydrates, which would otherwise trip a mismatch warning.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900;1,14..32,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        {/* Inline theme-init: prevents flash of light on dark-preference users */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
