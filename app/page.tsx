"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Howl } from 'howler';
import CalendarWidget from '@/components/CalendarWidget';

/* ─── SOUND EFFECTS ─── */
const hoverSound = typeof window !== 'undefined' ? new Howl({ src: ['/sounds/hover.mp3'], volume: 0.5 }) : null;
const selectSound = typeof window !== 'undefined' ? new Howl({ src: ['/sounds/select.mp3'], volume: 0.8 }) : null;

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
        className="relative z-10 w-[280px] h-[200px] md:w-[420px] md:h-[300px] will-change-transform transform-gpu"
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
          sizes="(max-width: 768px) 100vw, 50vw"
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
function MainMenu({ playEntranceWipe = false }: { playEntranceWipe?: boolean }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isCharacterHovered, setIsCharacterHovered] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const lastQuoteIndex = useRef<number>(-1);

  // Check touch device to disable default hover states
  const checkTouch = () => {
    return typeof window !== 'undefined' && (
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
    );
  };

  useEffect(() => {
    if (checkTouch()) {
      setActiveIndex(-1); // Remove default selection arrow on mobile
    }
  }, []);

  const characterQuotes = [
    "Take your time...",
    "Lagi males ngoding, Besok aja...",
    "Aman bae boy, hehe",
    "Ajarin ngoding dong bang"
  ];

  const handleCharacterClick = () => {
    if (bubbleText) return;

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * characterQuotes.length);
    } while (nextIndex === lastQuoteIndex.current && characterQuotes.length > 1);

    lastQuoteIndex.current = nextIndex;
    setBubbleText(characterQuotes[nextIndex]);

    setTimeout(() => {
      setBubbleText(null);
    }, 3000);
  };

  useGSAP(() => {
    if (!mainRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    if (playEntranceWipe) {
      tl.fromTo('.wipe-overlay-entrance',
        { x: '0%' },
        { x: '100%', duration: 1.1, ease: 'power3.inOut' }
      );
    } else {
      gsap.set('.wipe-overlay-entrance', { x: '100%' });
    }

    tl.fromTo('.character-art',
      { x: '10%', opacity: 0, scale: 0.9 },
      { x: '0%', opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.2)' },
      playEntranceWipe ? "-=0.4" : "0"
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

  const handleNavigation = useCallback((href: string) => {
    if (isWiping) return;
    setIsWiping(true);
    selectSound?.play();
    
    gsap.to('.wipe-overlay', {
      x: '0%',
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => {
        router.push(href);
      }
    });
  }, [isWiping, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'w', 's'].includes(e.key)) {
        e.preventDefault(); // prevent default scrolling
      }

      if (isWiping) return; // disable keys during wipe

      if (e.key === 'ArrowDown' || e.key === 's') {
        hoverSound?.play();
        setActiveIndex(prev => (prev + 1) % menuItems.length);
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        hoverSound?.play();
        setActiveIndex(prev => (prev - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0) {
          handleNavigation(menuItems[activeIndex].href);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, handleNavigation, isWiping]);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  const currentIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  return (
    <div
      ref={mainRef}
      className="fixed inset-0 bg-black overflow-hidden focus:outline-none"
      tabIndex={0}
    >
      <CalendarWidget />

      {/* Background */}
      <div className="absolute inset-0 z-0 bg-persona">
        <Image
          src="/img/WEBP/Background-persona 5.webp"
          alt="Persona Background"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
          unoptimized
        />
        <div className="absolute inset-0 halftone-bg opacity-30" />
        <div className="absolute inset-0 ink-noise opacity-40" />
      </div>

      {/* Middle/Center Decoration (Persona 5 Vibe) */}
      <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
        {/* Giant Rotating Logo Watermark */}
        <motion.div
          className="absolute left-[30%] top-[20%] opacity-[0.07] mix-blend-overlay will-change-transform transform-gpu"
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-[1000px] h-[1000px] relative">
             <Image src="/img/SVG/LOGO RN (FIX) 1.svg" alt="RN Logo Watermark" fill className="object-contain" unoptimized />
          </div>
        </motion.div>

        {/* Diagonal Scrolling Marquee Tape */}
        <div className="absolute top-[60%] md:top-[50%] left-[-20%] w-[150%] h-[80px] md:h-[100px] bg-black/90 border-y-[6px] border-[var(--color-primary)] transform -rotate-[10deg] -translate-y-1/2 flex items-center overflow-hidden hard-shadow-red shadow-2xl">
          <div className="absolute inset-0 stripes-overlay opacity-40" />
          <motion.div 
            className="flex whitespace-nowrap items-center h-full relative z-10 will-change-transform transform-gpu"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center h-full">
                <span className="persona-heading text-5xl md:text-6xl text-white mx-8 drop-shadow-[4px_4px_0_rgba(214,0,28,1)]">LET'S MAKE A DEAL</span>
                <span className="text-3xl md:text-4xl text-[var(--color-primary)] mx-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">★</span>
                <span className="persona-heading text-5xl md:text-6xl text-white mx-8 drop-shadow-[4px_4px_0_rgba(214,0,28,1)]">TAKE YOUR TIME</span>
                <span className="text-3xl md:text-4xl text-[var(--color-primary)] mx-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">★</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Character (Joker/Rayhan) - Placed Center */}
      <div className="absolute bottom-0 left-[35%] md:left-[50%] w-[700px] md:w-[950px] h-[90vh] md:h-[100vh] z-20 character-art pointer-events-none -translate-x-1/2">
        <Image
          src="/img/WEBP/karakter Rayhan-persona 5.webp"
          alt="Rayhan Nafish"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-contain object-bottom drop-shadow-2xl transition-transform duration-300 ${isCharacterHovered ? 'scale-[1.02]' : 'scale-100'}`}
          priority
          unoptimized
        />

        {/* Tight Hit-Box for Hover/Click to avoid transparent corners */}
        <div
          className="absolute bottom-0 left-[20%] right-[20%] top-[20%] pointer-events-auto cursor-none clickable z-30"
          style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)' }}
          onClick={handleCharacterClick}
          onMouseEnter={() => setIsCharacterHovered(true)}
          onMouseLeave={() => setIsCharacterHovered(false)}
        />

        {/* Comic Speech Bubble */}
        <AnimatePresence>
          {bubbleText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="absolute top-[10%] md:top-[8%] right-[10%] md:right-[22%] z-50 pointer-events-none"
            >
              <div className="relative">
                {/* Bubble Tail */}
                <div className="absolute -bottom-4 left-4 w-8 h-8 bg-white transform rotate-45 border-r-4 border-b-4 border-black z-0" />

                {/* Bubble Container */}
                <div className="relative bg-white border-4 border-black px-6 py-4 transform skew-x-[-2deg] rotate-1 shadow-[4px_4px_0_0_rgba(214,0,28,0.8)] z-10">
                  <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
                  <p className="font-bold text-black text-xl md:text-2xl whitespace-nowrap drop-shadow-sm">
                    {bubbleText}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RAYHAN NAFISH Logo - Bottom Center in front of character */}
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.8 }}
        className="absolute bottom-[-10px] md:bottom-[-20px] left-[40%] md:left-[50%] z-30 w-[400px] md:w-[600px] h-[150px] md:h-[220px] pointer-events-none -translate-x-1/2 name-header"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full h-full will-change-transform transform-gpu"
        >
          <Image
            src="/img/WEBP/RAYHAN NAFISH-persona 5.webp"
            alt="RAYHAN NAFISH Text Graphic"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            priority
          />
        </motion.div>
      </motion.div>

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
              <span className="text-white/90 font-semibold text-base md:text-lg">Aspiring Fullstack Developer<br />and Project Manager</span>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Solid RN Logo - Bottom Right (Static) */}
      <div 
        className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-50 pointer-events-none hidden md:block"
      >
        <div className="relative w-24 h-24 md:w-28 md:h-28">
          <Image 
            src="/img/SVG/LOGO RN (FIX).svg" 
            alt="RN Logo Solid" 
            fill 
            sizes="(max-width: 768px) 96px, 112px" 
            className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]" 
          />
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
              onMouseEnter={() => {
                if (checkTouch()) return;
                if (hoveredIndex !== idx) {
                  hoverSound?.play();
                }
                setHoveredIndex(idx); 
              }}
              onMouseLeave={() => {
                if (checkTouch()) return;
                setHoveredIndex(null);
              }}
              onClick={(e) => {
                e.preventDefault();
                setActiveIndex(idx); // Lock active state visually
                setHoveredIndex(idx); // Ensure it turns red immediately
                handleNavigation(item.href);
              }}
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

                  {/* Active Arrow Indicator (Right Side) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.5 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.5 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="absolute left-[102%] top-1/2 -translate-y-1/2 z-50 pointer-events-none"
                      >
                        <span className="text-[var(--color-primary)] font-black text-4xl md:text-5xl drop-shadow-[2px_2px_0_rgba(255,255,255,0.8)]">
                          ◀
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Left Navigation Hint */}
      <motion.div 
        className="absolute bottom-6 left-4 md:bottom-8 md:left-8 z-40 pointer-events-none"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="bg-black border-[3px] border-white px-3 py-1.5 md:px-5 md:py-2 flex items-center gap-3 transform skew-x-[-5deg] hard-shadow-white">
          <div className="absolute inset-0 stripes-overlay opacity-20" />
          
          <div className="flex items-center gap-2 relative z-10">
            <span className="text-[var(--color-primary)] font-black text-xl md:text-2xl animate-pulse">!</span>
            <span className="persona-heading text-white text-sm md:text-base tracking-widest mt-1 drop-shadow-md">NAVIGATE</span>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 relative z-10 font-black text-black text-[10px] md:text-xs ml-2 md:ml-4">
            <span className="bg-[var(--color-primary)] text-white px-2 py-0.5 border-2 border-white transform skew-x-[5deg] hard-shadow">W S</span>
            <span className="text-white text-sm">/</span>
            <span className="bg-[var(--color-primary)] text-white px-2 py-0.5 border-2 border-white transform skew-x-[5deg] hard-shadow">↑ ↓</span>
            <span className="bg-white text-black px-2 py-0.5 ml-1 md:ml-2 border-2 border-black transform skew-x-[5deg] uppercase hard-shadow">ENTER ↵</span>
          </div>
        </div>
      </motion.div>

      {/* Wipe Overlay Entrance */}
      <div 
        className="wipe-overlay-entrance fixed top-0 bottom-0 left-[-50vw] w-[150vw] bg-[var(--color-primary)] z-[9999] pointer-events-none transform translate-x-0"
        style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        <div className="absolute inset-0 stripes-overlay opacity-30 pointer-events-none" />
      </div>

      {/* Wipe Overlay Exit */}
      <div 
        className="wipe-overlay fixed top-0 bottom-0 left-[-50vw] w-[150vw] bg-[var(--color-primary)] z-[9999] pointer-events-none transform translate-x-full"
        style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        <div className="absolute inset-0 stripes-overlay opacity-30 pointer-events-none" />
      </div>

      {/* Scanline */}
      <div className="absolute inset-0 z-[9998] pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
      }} />
    </div>
  );
}

export default function Home() {
  const [loadingState, setLoadingState] = useState<'checking' | 'loading' | 'done' | 'just_finished'>('checking');

  useEffect(() => {
    if (sessionStorage.getItem('hasLoaded') === 'true') {
      setLoadingState('done');
    } else {
      setLoadingState('loading');
    }
  }, []);

  const handleLoadComplete = useCallback(() => {
    sessionStorage.setItem('hasLoaded', 'true');
    setLoadingState('just_finished');
  }, []);

  if (loadingState === 'checking') {
    return <div className="fixed inset-0 bg-black" />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {loadingState === 'loading' && <LoadingScreen key="loader" onComplete={handleLoadComplete} />}
      </AnimatePresence>
      {(loadingState === 'done' || loadingState === 'just_finished') && (
        <MainMenu playEntranceWipe={loadingState === 'done'} />
      )}
    </>
  );
}
