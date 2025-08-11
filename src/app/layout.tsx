import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/contexts/CartContext";
import PerformanceMonitor from "@/components/PerformanceMonitor";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shopify Store - Next.js E-commerce",
  description: "A modern e-commerce store built with Next.js and Shopify",
  keywords: ["e-commerce", "shopify", "next.js", "online store"],
  authors: [{ name: "Shopify Store" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-store.com",
    title: "Shopify Store - Next.js E-commerce",
    description: "A modern e-commerce store built with Next.js and Shopify",
    siteName: "Shopify Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Store - Next.js E-commerce",
    description: "A modern e-commerce store built with Next.js and Shopify",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <CartProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <PerformanceMonitor />
        </CartProvider>
      </body>
    </html>
  );
}
