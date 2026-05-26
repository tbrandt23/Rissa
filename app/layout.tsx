import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Riss Creative",
  description: "Creative direction, styling, and curation.",
};

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@200,300,400,500,700&f[]=satoshi@300,400,500&display=swap"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,300&display=swap"
        />
      </head>
      <body className="bg-background text-foreground">
        {/* depth: warm vignette, no chromatic color */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[90]"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        {/* film grain */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035] mix-blend-overlay"
          style={{ backgroundImage: GRAIN_SVG }}
        />
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
