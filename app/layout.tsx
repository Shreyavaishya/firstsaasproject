import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pixora: resize and optimize photos and videos for every platform",
  description: "Upload once and get your images and videos sized for Instagram, Reels, YouTube and X, with smaller video files. Free to start.",
  openGraph: {
    title: "Pixora",
    description: "Upload once. Get it sized for every platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
