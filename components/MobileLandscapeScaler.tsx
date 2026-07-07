"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MobileLandscapeScaler({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
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
        
        // Detect portrait based on scaled window dimensions to respond to rotation
        if (window.innerHeight > window.innerWidth) {
          setIsPortrait(true);
          let meta = document.querySelector('meta[name="viewport"]');
          if (meta) {
            meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
          }
        } else {
          setIsPortrait(false);
          let meta = document.querySelector('meta[name="viewport"]');
          if (meta) {
            meta.setAttribute('content', 'width=1280, user-scalable=no');
          }
        }
      } else {
        // Normal Desktop
        setIsMobile(false);
        setIsPortrait(false);
        let meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
          meta.setAttribute('content', 'width=device-width, initial-scale=1');
        }
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

  // 2. If mobile and landscape AND FULLSCREEN, force CSS scaling because Fullscreen bypasses Viewport Injection
  if (isMobile && !isPortrait && isFullscreen && typeof window !== 'undefined') {
    const physicalWidth = window.screen.width;
    const physicalHeight = window.screen.height;
    // In landscape, max is width, min is height
    const w = Math.max(physicalWidth, physicalHeight);
    const h = Math.min(physicalWidth, physicalHeight);
    
    // We want the layout to ALWAYS be 1280px wide.
    const virtualWidth = 1280;
    // Calculate the exact virtual height needed to perfectly fill the screen without black bars!
    const virtualHeight = virtualWidth * (h / w);
    
    // Scale factor to shrink the virtual layout down to the physical pixels
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

  // 3. If desktop OR (mobile and landscape but NOT fullscreen), render children normally.
  // The viewport meta tag handles the native scaling for us perfectly when not in fullscreen.
  return <div className="absolute inset-0">{children}</div>;
}
