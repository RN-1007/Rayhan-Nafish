"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Howl } from 'howler';

const hoverSound = typeof window !== 'undefined' ? new Howl({ src: ['/sounds/hover.mp3'], volume: 0.5 }) : null;
const backSound = typeof window !== 'undefined' ? new Howl({ src: ['/sounds/back.mp3'], volume: 0.8 }) : null;

import CalendarWidget from '@/components/CalendarWidget';

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isWiping, setIsWiping] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [showBubble, setShowBubble] = useState(false);

  const bubblePhrases = [
    "hehe",
    "capek jir",
    "iri? bilang bos"
  ];

  const handleCharacterClick = () => {
    const randomText = bubblePhrases[Math.floor(Math.random() * bubblePhrases.length)];
    setBubbleText(randomText);
    setShowBubble(true);

    setTimeout(() => {
      setShowBubble(false);
    }, 3000);
  };

  const handleBack = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    if (e) e.preventDefault();
    if (isWiping) return;
    setIsWiping(true);

    backSound?.play();

    gsap.to('.wipe-overlay-exit', {
      x: '0%',
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => {
        router.push('/');
      }
    });
  }, [isWiping, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' || e.key === 'Escape') {
        handleBack(e);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBack]);

  useGSAP(() => {
    if (!pageRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo('.wipe-overlay-entrance',
      { x: '0%' },
      { x: '100%', duration: 1.1, ease: 'power3.inOut' }
    )
      .fromTo('.character-portrait',
        { x: '10%', opacity: 0, scale: 0.9 },
        { x: '0%', opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.2)' },
        "-=0.5"
      )
      .fromTo('.about-header',
        { x: -100, y: -50, opacity: 0, rotation: -10 },
        { x: 0, y: 0, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.5)' },
        "-=0.4"
      )
      .fromTo('.bio-box',
        { x: -100, opacity: 0, skewX: 20 },
        { x: 0, opacity: 1, skewX: -4, duration: 0.5, ease: 'power3.out' },
        "-=0.3"
      )
      .fromTo('.status-box',
        { y: 100, opacity: 0, rotation: 10 },
        { y: 0, opacity: 1, rotation: -2, duration: 0.6, ease: 'back.out(1.2)' },
        "-=0.2"
      )
      .fromTo('.codename-box',
        { x: 100, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
        "-=0.2"
      )
      .fromTo('.radar-polygon',
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' },
        "-=0.3"
      );
  }, { scope: pageRef });

  const stats = [
    { name: 'Knowledge', value: 90 },
    { name: 'Creativity', value: 95 },
    { name: 'Code', value: 85 },
    { name: 'Design', value: 92 },
    { name: 'Problem Solving', value: 88 },
  ];

  const radarSize = 200;
  const center = radarSize / 2;
  const maxRadius = 65;
  const angleStep = (Math.PI * 2) / 5;

  const getPoints = (radiusFn: (stat: any) => number) => {
    return stats.map((stat, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const radius = radiusFn(stat);
      return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
    }).join(" ");
  };

  const polygonPoints = getPoints((stat) => (stat.value / 100) * maxRadius);
  const maxPolygonPoints = getPoints(() => maxRadius);
  const midPolygonPoints = getPoints(() => maxRadius * 0.5);

  return (
    <div ref={pageRef} className="fixed inset-0 bg-black overflow-hidden">
      <CalendarWidget position="top-right" />

      {/* Background */}
      <div className="absolute inset-0 z-0 bg-persona">
        <Image
          src="/img/WEBP/Background-persona 5.webp"
          alt="Persona Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 halftone-bg opacity-40" />
        <div className="absolute inset-0 ink-noise opacity-50" />
      </div>

      {/* Character */}
      <div className="absolute bottom-0 right-[-5%] md:right-[0%] w-[700px] md:w-[900px] h-[95vh] md:h-[100vh] z-10 character-portrait pointer-events-none">
        
        {/* Speech Bubble */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute top-[25%] right-[20%] md:top-[30%] md:right-[40%] z-50 pointer-events-auto"
            >
              <div className="bg-white border-[4px] border-black px-6 py-4 transform skew-x-[-5deg] hard-shadow relative">
                <div className="absolute inset-0 stripes-overlay opacity-10" />
                <p className="persona-heading text-black text-2xl md:text-3xl relative z-10">
                  {bubbleText}
                </p>
                {/* Speech Bubble Tail */}
                <div className="absolute -bottom-4 right-8 w-6 h-6 bg-white border-b-[4px] border-r-[4px] border-black transform rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Image
          src="/img/WEBP/karakter Rayhan-persona 5.webp"
          alt="Rayhan"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain object-bottom pointer-events-auto cursor-pointer transition-transform hover:scale-[1.02]"
          priority
          onClick={handleCharacterClick}
        />
      </div>

      {/* Top Left: About Me Logo */}
      <div className="absolute top-[2%] left-[-10%] z-30 about-header pointer-events-none w-[450px] md:w-[800px] h-[180px] md:h-[300px]">
        <Image
          src="/img/WEBP/About me-persona 5.webp"
          alt="About Me"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain object-top object-left drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
          priority
        />
      </div>

      {/* Bio Box */}
      <div className="absolute top-1/2 -translate-y-1/2 left-[5%] z-30 bio-box pointer-events-auto w-[90%] md:w-[650px]">
        <div className="bg-black border-[4px] border-white px-6 md:px-8 py-6 transform skew-x-[-4deg] hard-shadow relative">
          <div className="absolute inset-0 stripes-overlay opacity-20 pointer-events-none" />
          <div className="transform skew-x-[4deg] flex flex-col gap-6">

            {/* Top Row: Bio Text + Radar Chart */}
            <div className="flex flex-col md:flex-row gap-6 md:items-center">

              {/* Bio Text */}
              <div className="flex-1">
                <p className="text-white font-black text-2xl md:text-3xl mb-4 relative z-10">
                  <span className="text-[var(--color-primary)] persona-heading tracking-widest">Rayhan Nafish</span>
                </p>
                <p className="text-white/90 text-sm md:text-base font-semibold leading-relaxed relative z-10">
                  Fullstack Developer & Project Engineer yang jadiin teknologi kaya playground! Paling excited buat ngulik hal-hal baru and nyulap ide ribet jadi solusi digital yang cool AF.                </p>
              </div>

              {/* Radar Chart Inside Card */}
              <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] shrink-0 status-box relative z-10 self-center md:self-auto">
                <div className="relative w-full h-full transform skew-x-[-2deg] rotate-2">
                  <svg width="100%" height="100%" viewBox={`0 0 ${radarSize} ${radarSize}`} className="drop-shadow-[0_0_10px_rgba(214,0,28,0.5)]">
                    {/* Background Grid */}
                    <polygon points={maxPolygonPoints} fill="rgba(0,0,0,0.6)" stroke="white" strokeWidth="2" />
                    <polygon points={midPolygonPoints} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                    {/* Grid Lines from Center */}
                    {stats.map((_, i) => {
                      const angle = i * angleStep - Math.PI / 2;
                      return (
                        <line
                          key={`line-${i}`}
                          x1={center} y1={center}
                          x2={center + Math.cos(angle) * maxRadius}
                          y2={center + Math.sin(angle) * maxRadius}
                          stroke="rgba(255,255,255,0.2)" strokeWidth="1"
                        />
                      );
                    })}

                    {/* Stat Polygon */}
                    <polygon
                      className="radar-polygon"
                      points={polygonPoints}
                      fill="rgba(214,0,28,0.7)"
                      stroke="var(--color-primary)"
                      strokeWidth="3"
                    />
                  </svg>

                  {/* Radar Labels */}
                  {stats.map((stat, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const labelRadius = maxRadius + 22;
                    const x = center + Math.cos(angle) * labelRadius;
                    const y = center + Math.sin(angle) * labelRadius;
                    return (
                      <div
                        key={stat.name}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${(x / radarSize) * 100}%`, top: `${(y / radarSize) * 100}%` }}
                      >
                        <div className="bg-black/90 border border-[var(--color-primary)] px-1 py-0.5 transform skew-x-[-10deg]">
                          <span className="block text-white font-black text-[8px] md:text-[9px] tracking-widest uppercase transform skew-x-[10deg]">{stat.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Confidant Profile Details */}
            <div className="w-full grid grid-cols-2 gap-3 border-t-2 border-white/20 pt-4 relative z-10">
              <div>
                <span className="block text-[var(--color-primary)] text-xs font-black uppercase tracking-wider">Arcana</span>
                <span className="text-white font-bold text-sm">The Magician</span>
              </div>
              <div>
                <span className="block text-[var(--color-primary)] text-xs font-black uppercase tracking-wider">Base</span>
                <span className="text-white font-bold text-sm">Indonesia, Madiun </span>
              </div>
              <div>
                <span className="block text-[var(--color-primary)] text-xs font-black uppercase tracking-wider">Class</span>
                <span className="text-white font-bold text-sm">Fullstack & ProjSect Manager</span>
              </div>
              <div>
                <span className="block text-[var(--color-primary)] text-xs font-black uppercase tracking-wider">Status</span>
                <span className="text-white font-bold text-sm">Open to Work</span>
              </div>
            </div>

          </div>
        </div>
      </div>



      {/* Bottom Right: Codename Box */}
      <div className="absolute bottom-[8%] right-[5%] z-30 codename-box pointer-events-none">
        <div className="bg-black border-[4px] border-white p-4 transform rotate-2 hard-shadow-red flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 stripes-overlay opacity-30" />
          <div className="relative z-10">
            <p className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-1">Codename</p>
            <p className="persona-heading text-4xl md:text-5xl text-[var(--color-primary)] mb-2 leading-none">DEVELOPER</p>
            <div className="flex items-end justify-end gap-2">
              <span className="persona-heading text-white text-3xl leading-none">LV 99</span>
              <span className="text-[var(--color-primary)] font-black text-xl animate-pulse drop-shadow-[0_0_8px_rgba(214,0,28,0.8)]">MAX!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <Link
        href="/"
        onClick={handleBack}
        onMouseEnter={() => hoverSound?.play()}
        className="fixed bottom-6 left-[50%] -translate-x-1/2 md:left-6 md:translate-x-0 z-50 group"
      >
        <motion.div
          className="flex items-center gap-2 bg-black/90 border-2 border-white px-5 py-2 transform skew-x-[-10deg] hard-shadow hover:bg-[var(--color-primary)] transition-colors clickable"
          whileHover={{ x: -5, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="transform skew-x-[10deg] flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-xl">◀</span>
              <span className="text-white font-bold text-sm md:text-base uppercase tracking-widest persona-heading">BACK TO MENU</span>
            </div>
            {/* Keyboard Hint */}
            <div className="hidden md:flex gap-1 ml-2 text-white text-[10px] font-black uppercase tracking-wider">
              <span className="bg-white/20 px-2 py-0.5 border border-white/40">BACKSPACE</span>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Wipe Overlay Entrance */}
      <div
        className="wipe-overlay-entrance fixed top-0 bottom-0 left-[-50vw] w-[150vw] bg-[var(--color-primary)] z-[9999] pointer-events-none transform translate-x-0"
        style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        <div className="absolute inset-0 stripes-overlay opacity-30 pointer-events-none" />
      </div>

      {/* Wipe Overlay Exit */}
      <div
        className="wipe-overlay-exit fixed top-0 bottom-0 left-[-50vw] w-[150vw] bg-[var(--color-primary)] z-[9999] pointer-events-none transform translate-x-full"
        style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        <div className="absolute inset-0 stripes-overlay opacity-30 pointer-events-none" />
      </div>

      {/* Scanline */}
      <div className="absolute inset-0 z-40 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
      }} />
    </div>
  );
}
