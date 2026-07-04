"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (!hasMoved) setHasMoved(true);
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX - 12 + 'px';
        cursorRef.current.style.top = e.clientY - 12 + 'px';
      }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px';
        dotRef.current.style.top = e.clientY + 'px';
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .menu-item, .clickable')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [hasMoved]);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="game-cursor hidden md:block"
        style={{ 
          transform: isHovering ? 'scale(1.8) rotate(45deg)' : 'scale(1) rotate(0deg)',
          borderColor: isHovering ? '#FFFFFF' : '#D6001C',
          opacity: hasMoved ? 1 : 0,
        }}
      />
      <div ref={dotRef} className="game-cursor-dot hidden md:block" style={{ opacity: hasMoved ? 1 : 0 }} />
    </>
  );
}
