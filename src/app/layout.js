import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "PreciFarm AI — Expert Botanical Diagnostics",
  description:
    "Next-generation AI-powered plant pathology. Scan any crop to receive instant, expert-level diagnostics, tailored treatment protocols, and field management insights.",
  keywords: "plant disease detection, crop scanner, farming AI, botanical diagnostics, expert agriculture AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${outfit.variable}`}>
      <body className="min-h-screen antialiased bg-background text-text font-sans">
        {children}
      </body>
    </html>
  );
}
