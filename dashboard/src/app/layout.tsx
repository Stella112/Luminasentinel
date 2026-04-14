import type { Metadata } from "next";
import { Space_Grotesk, Outfit, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Lumina Sentinel | Your Onchain Jarvis",
  description: "Personal AI Life OS & Finance Guardian — powered by Nosana Qwen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
