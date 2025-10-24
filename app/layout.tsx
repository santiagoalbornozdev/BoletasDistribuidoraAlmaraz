import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Generador de Boletas - Distribuidora Almaraz",
  description: "Sistema de facturación para cigarrillos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="bg-white">
      <body
        className={`${inter.className} bg-white text-gray-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}