"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MobileLandscapeScaler({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Define "mobile/tablet" as screens smaller than 1024px wide natively
      // But wait, if we override the viewport to 1280, window.innerWidth becomes 1280!
      // So we must check screen.width which is the physical device screen width.
      const physicalWidth = window.screen.width;
      const physicalHeight = window.screen.height;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || Math.min(physicalWidth, physicalHeight) < 768;

      if (isMobileDevice) {
        setIsMobile(true);
        setIsPortrait(window.innerHeight > window.innerWidth);
      } else {
        // Normal Desktop
        setIsMobile(false);
        setIsPortrait(false);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Avoid Hydration Mismatch by returning standard layout on first render
  if (!isMounted) {
    return <div className="absolute inset-0">{children}</div>;
  }

  // 1. If mobile and portrait, show rotation warning
  if (isMobile && isPortrait) {
    return (
      <div className="fixed inset-0 z-[9999999] bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute inset-0 stripes-overlay opacity-30 pointer-events-none" />
        <motion.div 
          className="bg-[var(--color-primary)] border-[5px] border-white px-8 py-10 transform skew-x-[-5deg] hard-shadow-white relative z-10 flex flex-col items-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-20 h-20 mb-6 border-4 border-white flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
            <span className="text-white text-4xl transform -rotate-90">📱</span>
          </div>
          <h1 className="persona-heading text-white text-3xl md:text-4xl drop-shadow-[3px_3px_0_rgba(0,0,0,0.8)] mb-4">
            LANDSCAPE REQUIRED
          </h1>
          <p className="text-white font-black tracking-widest uppercase">
            Please rotate your device to play
          </p>
        </motion.div>
      </div>
    );
  }

  // 2. If mobile and landscape, ALWAYS force CSS scaling
  if (isMobile && !isPortrait && typeof window !== 'undefined') {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // We want the layout to ALWAYS be 1280px wide.
    const virtualWidth = 1280;
    // Calculate the exact virtual height needed to perfectly fill the screen without black bars!
    const virtualHeight = virtualWidth * (h / w);
    
    // Scale factor to shrink the virtual layout down to the viewport pixels
    const scale = w / virtualWidth;

    return (
      <div className="fixed inset-0 bg-black overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-0 origin-top-left bg-black pointer-events-auto"
          style={{ 
            width: `${virtualWidth}px`, 
            height: `${virtualHeight}px`,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  // 3. For large desktop monitors or non-standard aspect ratios (ultrawide/square), force CSS scaling
  // This preserves the exact laptop layout (1280x720 equivalent) on any monitor without breaking.
  // Standard laptops (width <= 1536 and ~16:9 ratio) will bypass this and render natively!
  if (!isMobile) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    const screenW = window.screen.width;
    const screenH = window.screen.height;
    const screenRatio = screenW / screenH;
    
    // Check physical screen dimensions to avoid triggering on laptops with browser UI
    const isLargeOrWeirdMonitor = screenW > 2000 || screenRatio > 1.8 || screenRatio < 1.5;

    if (isLargeOrWeirdMonitor) {
      // Force a strict 16:9 layout just like a game engine
      const virtualWidth = 1280;
      const virtualHeight = 720;
      const scale = Math.min(w / virtualWidth, h / virtualHeight);

      return (
        <div className="fixed inset-0 bg-black overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/2 left-1/2 bg-black pointer-events-auto"
            style={{ 
              width: `${virtualWidth}px`, 
              height: `${virtualHeight}px`,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          >
            {children}
          </div>
        </div>
      );
    }
  }

  // 4. If standard laptop, render natively.
  return <div className="absolute inset-0">{children}</div>;
}
