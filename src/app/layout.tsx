import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";   
import "./globals.css";
import dynamic from 'next/dynamic';
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Betterzojewels Online - Premium Jewelry Store",
  description: "Discover our exclusive collection of premium jewelry. Shop for rings, necklaces, earrings, and more with secure payment options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 text-slate-900`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <CartProvider>
            {/* <NProgressClientWrapper /> */}
            {children}
            <Toaster position="top-right" richColors />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
