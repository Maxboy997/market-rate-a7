import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "প্রতিদিনের সঠিক বাজার মূল্য",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <Toaster position="top-right" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}