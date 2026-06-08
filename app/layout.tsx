import type { Metadata, Viewport } from "next";
import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Буряад хэлэн",
  description: "Учим бурятский вместе",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${nunito.variable} ${playfair.variable}`}>
      <head>
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}>
        <main className="pb-20 min-h-screen" style={{ background: "#faf8f4" }}>
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
