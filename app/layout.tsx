import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lab Kimia Virtual – Kelas X",
  description:
    "Laboratorium Kimia Virtual berbasis Problem-Based Learning untuk siswa Kelas X Kurikulum Merdeka",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-50 min-h-screen`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
