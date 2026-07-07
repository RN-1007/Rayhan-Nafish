import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rayhan Nafish",
  description: "Aspiring Software Engineer. Persona 5 themed interactive portfolio experience.",
  icons: {
    icon: '/img/SVG/LOGO RN (FIX) 1.svg',
  },
};

import BackgroundMusic from '@/components/BackgroundMusic';
import GameCursor from '@/components/ui/GameCursor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full">
        <BackgroundMusic />
        {children}
        <GameCursor />
      </body>
    </html>
  );
}
