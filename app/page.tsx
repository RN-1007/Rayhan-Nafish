"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/* ─── MENU DATA ─── */
const menuItems = [
  { id: 'about', title: 'About Me', href: '/about' },
  { id: 'projects', title: 'Projects', href: '/projects' },
  { id: 'skills', title: 'Skills', href: '/skills' },
  { id: 'contact', title: 'Contact', href: '/contact' },
];

/* ─── LOADING SCREEN ─── */
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 2;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
      setProgress(current);
    }, 120);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      key="loading-screen"
      exit={{
        opacity: 0,
        scale: 1.1,
        filter: "blur(8px) brightness(2)",
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden scanline-overlay"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/WEBP/loading background.webp"
          alt="Loading Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 stripes-overlay" />
      </div>

      <motion.div
        className="relative z-10 w-[280px] h-[200px] md:w-[420px] md:h-[300px]"
        animate={{
          rotate: [0, -4, 4, -2, 0],
          scale: [1, 1.05, 1, 1.03, 1],
          y: [0, -8, 0, -4, 0],
        }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
      >
        <Image
          src="/img/WEBP/loading_lets go-persona 5.webp"
          alt="Let's Go!"
          fill
          className="object-contain drop-shadow-[0_0_30px_rgba(214,0,28,0.6)]"
          priority
        />
      </motion.div>

      <div className="relative z-10 mt-12 w-[320px] md:w-[450px]">
        <div className="h-2 bg-white/20 border border-white/40 overflow-hidden">
          <motion.div
            className="h-full bg-[var(--color-primary)]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Now Loading</span>
          <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MAIN MENU ─── */
function MainMenu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!mainRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo('.bg-persona',
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1 }
    )
      .fromTo('.character-art',
        { x: '10%', opacity: 0, scale: 0.9 },
        { x: '0%', opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.2)' },
        "-=0.5"
      )
      .fromTo('.left-text-block',
        { x: -100, opacity: 0, skewX: 20 },
        { x: 0, opacity: 1, skewX: 0, duration: 0.6, ease: 'power3.out' },
        "-=0.4"
      )
      .fromTo('.menu-item',
        { x: 200, opacity: 0, skewX: -10 },
        { x: 0, opacity: 1, skewX: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.2)' },
        "-=0.4"
      );
  }, { scope: mainRef });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 's') {
        setActiveIndex(prev => (prev + 1) % menuItems.length);
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        setActiveIndex(prev => (prev - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === 'Enter') {
        window.location.href = menuItems[activeIndex].href;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const currentIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  return (
    <div ref={mainRef} className="fixed inset-0 bg-black overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0 bg-persona">
        <Image
          src="/img/WEBP/Background-persona 5.webp"
          alt="Persona Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 halftone-bg opacity-30" />
        <div className="absolute inset-0 ink-noise opacity-40" />
      </div>

      {/* Character (Joker/Rayhan) - Placed Center */}
      <div className="absolute bottom-0 left-[28%] md:left-[50%] w-[700px] md:w-[950px] h-[90vh] md:h-[100vh] z-20 character-art pointer-events-none -translate-x-1/2">
        <Image
          src="/img/WEBP/karakter Rayhan-persona 5.webp"
          alt="Rayhan Nafish"
          fill
          className="object-contain object-bottom"
          priority
        />
      </div>

      {/* Left Text Block */}
      <div className="absolute top-[20%] left-[5%] md:left-[8%] z-30 left-text-block pointer-events-none flex flex-col gap-6 max-w-[500px]">
        {/* Main Header Box */}
        <div className="relative">
          {/* Decorative Background layers for jagged effect */}
          <div className="absolute -inset-2 bg-white transform skew-x-[4deg] rotate-[-2deg]" />
          <div className="absolute -inset-1 bg-black transform skew-x-[-2deg] rotate-[1deg]" />

          <div className="bg-black px-6 py-4 transform skew-x-[-6deg] relative z-10 border-4 border-white hard-shadow">
            <h1 className="persona-heading text-5xl md:text-6xl text-white leading-tight transform skew-x-[6deg]">
              TAKE YOUR TIME,<br />
              AND EXPLORE<br />
              MY <span className="text-[var(--color-primary)]">PORTFOLIO.</span>
            </h1>
          </div>
        </div>

        {/* Subtitle Text */}
        <div className="relative ml-4 mt-2 inline-block">
          {/* Background Box for Subtitle */}
          <div className="absolute inset-0 bg-black border-2 border-white transform skew-x-[-4deg] -z-10 shadow-[4px_4px_0_0_rgba(214,0,28,0.5)]" />
          <div className="absolute inset-0 stripes-overlay opacity-30 -z-10 transform skew-x-[-4deg]" />
          <div className="px-6 py-3 transform skew-x-[4deg]">
            <p className="text-white font-bold text-lg md:text-xl leading-relaxed drop-shadow-md">
              Hi, I'm <span className="text-[var(--color-primary)]">Rayhan Nafish</span><br />
              <span className="text-white/90 font-semibold text-base md:text-lg">Aspiring Software Engineer<br />and Problem Solver.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Menu Stack */}
      <div className="absolute top-[50%] -translate-y-1/2 right-[5%] md:right-[10%] z-40 flex flex-col gap-4">
        {menuItems.map((item, idx) => {
          const isActive = currentIndex === idx;
          // Generate a slightly different jagged shape per item for organic feel
          const clipPathOuter = `polygon(${idx % 2 === 0 ? '4%' : '2%'} 0%, 100% ${idx % 2 === 0 ? '2%' : '4%'}, ${idx % 2 === 0 ? '97%' : '95%'} 100%, 0% ${idx % 2 === 0 ? '95%' : '98%'}, 2% 45%)`;
          const clipPathInner = `polygon(${idx % 2 === 0 ? '4%' : '2%'} 0%, 100% ${idx % 2 === 0 ? '2%' : '4%'}, ${idx % 2 === 0 ? '97%' : '95%'} 100%, 0% ${idx % 2 === 0 ? '95%' : '98%'}, 2% 45%)`;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="menu-item block group relative clickable"
              onMouseEnter={() => { setHoveredIndex(idx); setActiveIndex(idx); }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative flex items-center justify-end">
                <motion.div
                  animate={{
                    x: isActive ? -30 : 0,
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative w-[300px] md:w-[350px] h-[65px] md:h-[80px]"
                >
                  {/* Outer White Border (using clip-path) */}
                  <div
                    className={`absolute inset-0 ${isActive ? 'bg-white' : 'bg-white/80'} shadow-lg`}
                    style={{ clipPath: clipPathOuter }}
                  />

                  {/* Inner Colored Background */}
                  <div
                    className={`absolute top-[4px] bottom-[4px] left-[4px] right-[4px] transition-colors duration-200
                      ${isActive ? 'bg-[var(--color-primary)]' : 'bg-black hover:bg-[#1a1a1a]'}`}
                    style={{ clipPath: clipPathInner }}
                  >
                    {/* Stripes inside active */}
                    {isActive && <div className="absolute inset-0 stripes-overlay opacity-30 pointer-events-none" />}
                  </div>

                  {/* Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`
                      font-bold text-2xl md:text-3xl text-center transform -rotate-2
                      ${isActive ? 'text-white drop-shadow-md' : 'text-white'}
                    `}>
                      {item.title}
                    </span>
                  </div>
                </motion.div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Left Hint */}
      <div className="absolute bottom-6 left-6 z-40 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 animate-pulse-glow">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span className="text-white font-bold text-sm tracking-wide">Choose an option.</span>
        </div>
        <div className="flex gap-1 text-white text-xs font-black uppercase ml-4">
          <span className="bg-white/20 px-2 py-1 border border-white/40">↑↓</span>
          <span className="bg-white/20 px-2 py-1 border border-white/40">ENTER</span>
        </div>
      </div>

      {/* Scanline */}
      <div className="absolute inset-0 z-50 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
      }} />
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const handleLoadComplete = useCallback(() => setIsLoading(false), []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" onComplete={handleLoadComplete} />}
      </AnimatePresence>
      {!isLoading && <MainMenu />}
    </>
  );
}
