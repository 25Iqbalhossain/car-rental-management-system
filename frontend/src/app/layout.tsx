import type { Metadata } from "next";
import "./globals.css";
import { ChatWidget } from "@/components/customer/ChatWidget";

export const metadata: Metadata = {
  title: "Digital Pylot — Car Rental Platform & Admin Dashboard",
  description: "Car Rental Admin Dashboard & Customer Platform - Fully functional, dynamic management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}

