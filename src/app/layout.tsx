import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Cat Nanny - Professional In-Home Cat Sitting in Ottawa",
  description: "Loving, reliable, and stress-free in-home cat sitting services in Ottawa. Professional care for your feline friends with daily updates and photos.",
  keywords: "cat sitting, pet sitting, Ottawa, cat care, in-home pet care, cat nanny",
  authors: [{ name: "The Cat Nanny" }],
  openGraph: {
    title: "The Cat Nanny - Professional Cat Sitting in Ottawa",
    description: "Loving, reliable, and stress-free in-home cat sitting services in Ottawa.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${nunito.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
