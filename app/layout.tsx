import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: 1280, // Force desktop width on mobile
  userScalable: false,
};

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
      <body className="h-full bg-black">
        {/* Portrait Blocker (Landscape Enforcement) */}
        <div className="fixed inset-0 z-[99999999] bg-black text-white flex-col items-center justify-center portrait:flex landscape:hidden">
           <div className="w-24 h-24 mb-8 border-4 border-white rounded-xl flex items-center justify-center animate-[spin_2s_ease-in-out_infinite]">
             <span className="text-5xl transform -rotate-90">📱</span>
           </div>
           <h1 className="persona-heading text-4xl md:text-5xl text-center text-[var(--color-primary)]">
             PLEASE ROTATE<br/>YOUR DEVICE
           </h1>
           <p className="mt-4 font-black tracking-widest uppercase text-center max-w-sm px-4">
             This interactive experience is designed for landscape mode.
           </p>
        </div>

        {/* Main App */}
        <BackgroundMusic />
        {children}
        <GameCursor />
      </body>
    </html>
  );
}
