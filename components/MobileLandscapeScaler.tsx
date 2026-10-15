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
      // Define "mobile/tablet" as screens smaller than 1024px wide natively
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

    // 1. Prevent desktop keyboard zoom shortcuts (Ctrl/Cmd + '+', '-', '0', '=', '_')
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const isZoomKey = 
          e.key === '+' ||
          e.key === '-' ||
          e.key === '=' ||
          e.key === '_' ||
          e.key === '0' ||
          e.code === 'Equal' ||
          e.code === 'Minus' ||
          e.code === 'Digit0' ||
          e.code === 'NumpadAdd' ||
          e.code === 'NumpadSubtract' ||
          e.code === 'Numpad0';

        if (isZoomKey) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    // 2. Prevent mouse wheel & touchpad pinch-to-zoom with Ctrl key
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 3. Prevent Safari/WebKit gesture zooming (trackpad pinch)
    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    // 4. Prevent multi-touch pinch zooming on touchscreens
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Attach zoom prevention listeners
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    document.addEventListener('gesturestart', preventGesture);
    document.addEventListener('gesturechange', preventGesture);
    document.addEventListener('gestureend', preventGesture);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);

      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('wheel', handleWheel, { capture: true });
      document.removeEventListener('wheel', handleWheel, { capture: true });
      document.removeEventListener('gesturestart', preventGesture);
      document.removeEventListener('gesturechange', preventGesture);
      document.removeEventListener('gestureend', preventGesture);
      document.removeEventListener('touchmove', handleTouchMove);
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
    
    // We want the mobile landscape layout to ALWAYS be 1280px wide.
    const virtualWidth = 1280;
    const virtualHeight = virtualWidth * (h / w);
    const scale = w / virtualWidth;

    return (
      <div className="fixed inset-0 bg-black overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-0 origin-top-left bg-black pointer-events-auto"
          style={{ 
            width: `${virtualWidth}px`, 
            height: `${virtualHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  // 3. For Desktop: Render natively at 100% scale exactly as designed.
  // All zoom shortcuts (Ctrl +, Ctrl -, Ctrl 0) and Ctrl+Wheel/trackpad gestures
  // are strictly intercepted and blocked by the event listeners above, keeping the screen at 100%.
  return <div className="absolute inset-0">{children}</div>;
}
