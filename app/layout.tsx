import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fresh Supermarket Store",
  description: "Quality groceries delivered straight to your door",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}