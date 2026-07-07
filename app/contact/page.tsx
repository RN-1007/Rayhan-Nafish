"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Howl } from 'howler';

const hoverSound = typeof window !== 'undefined' ? new Howl({ src: ['/sounds/hover.mp3'], volume: 0.5 }) : null;
const backSound = typeof window !== 'undefined' ? new Howl({ src: ['/sounds/back.mp3'], volume: 0.8 }) : null;

const contactInfo = [
  { icon: '✉', label: 'Email', value: 'rayhannafishdwip@gmail.com', color: 'text-[var(--color-primary)]', span: 'col-span-2' },
  { icon: 'in', label: 'LinkedIn', value: 'rayhannafish', color: 'text-blue-400', span: 'col-span-2 md:col-span-1' },
  { icon: 'IG', label: 'Instagram', value: '@rayhannafish', color: 'text-pink-500', span: 'col-span-2 md:col-span-1' },
  { icon: '⌨', label: 'GitHub', value: 'RN-1007', color: 'text-white', span: 'col-span-2 md:col-span-1' },
  { icon: '📍', label: 'Location', value: 'Madiun, ID', color: 'text-green-400', span: 'col-span-2 md:col-span-1' },
];

export default function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isWiping, setIsWiping] = useState(false);

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

    tl.fromTo('.contact-title', { x: -100, y: -50, opacity: 0, rotation: -10 }, { x: 0, y: 0, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.5)', delay: 0.2 })
      .fromTo('.contact-item', { x: -100, opacity: 0, skewX: 20 }, { x: 0, opacity: 1, skewX: -4, duration: 0.4, stagger: 0.05, ease: 'power3.out' }, '-=0.3')
      .fromTo('.character-contact', { x: 100, y: 100, opacity: 0, scale: 0.8 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)' }, '-=0.4')
      .fromTo('.calling-card', { scale: 0, rotation: -40, opacity: 0 }, { scale: 1, rotation: 6, opacity: 1, duration: 0.6, ease: 'back.out(2)' }, '-=0.2');
  }, { scope: pageRef });

  const handleSendCallingCard = () => {
    const email = "rayhannafishdwip@gmail.com";
    const subject = encodeURIComponent("CALLING CARD: Let's Make A Deal! 🎩");
    const body = encodeURIComponent(
      "Hey Rayhan,\n\nI just visited your awesome portfolio and I'd like to make a deal with you!\n\nHere are my details:\n- Name: [Your Name]\n- Company/Role: [Your Company]\n- Purpose: [What you want to talk about]\n\nLet's talk soon!\n\nTake your time,\n[Your Name]"
    );
    
    // Redirect langsung ke website Gmail (membuka tab baru) agar selalu bekerja meskipun user tidak memiliki aplikasi email default di komputernya.
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div ref={pageRef} className="absolute inset-0 bg-black overflow-hidden">
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

      {/* Top Left: Title */}
      <div className="absolute top-[3%] left-[3%] z-30 contact-title pointer-events-none">
        <div className="bg-black border-[4px] border-white px-6 md:px-10 py-3 transform skew-x-[-5deg] hard-shadow relative">
          <div className="absolute inset-0 stripes-overlay opacity-20" />
          <h1 className="persona-heading text-5xl md:text-7xl text-white relative z-10 transform skew-x-[5deg] drop-shadow-[4px_4px_0_rgba(214,0,28,1)]">
            CONTACT<span className="text-[var(--color-primary)] drop-shadow-[4px_4px_0_rgba(255,255,255,1)]"> ME</span>
          </h1>
        </div>
      </div>

      {/* Left Column: Contact Items (Grid Layout) */}
      <div className="absolute top-[20%] left-[3%] z-20 w-full max-w-[550px] flex flex-col gap-3 pointer-events-auto">
        <div className="contact-item bg-white px-4 py-1.5 inline-block border-[3px] border-black hard-shadow-white mb-1 transform -rotate-2 w-max">
          <span className="persona-heading text-black text-xl md:text-2xl tracking-wider">LET'S WORK TOGETHER!</span>
        </div>

        {/* 2-Column Grid for Links */}
        <div className="grid grid-cols-2 gap-3 pl-1 md:pl-2">
          {contactInfo.map((item) => (
            <motion.div
              key={item.label}
              onMouseEnter={() => hoverSound?.play()}
              className={`contact-item ${item.span} bg-black border-[3px] border-white p-3 flex items-center gap-3 transform skew-x-[-4deg] hard-shadow group clickable relative overflow-hidden transition-colors hover:bg-white`}
              whileHover={{ x: 10, skewX: -2 }}
            >
              <div className="absolute inset-0 stripes-overlay opacity-10 pointer-events-none group-hover:opacity-5" />

              {/* Icon */}
              <div className={`w-10 h-10 md:w-12 md:h-12 bg-black border-2 border-white flex items-center justify-center transform -skew-x-6 text-lg md:text-xl font-black ${item.color} shrink-0 relative z-10 shadow-[3px_3px_0_0_rgba(255,255,255,0.4)] group-hover:shadow-[3px_3px_0_0_var(--color-primary)]`}>
                <span className="skew-x-6 drop-shadow-md">{item.icon}</span>
              </div>

              {/* Info */}
              <div className="transform skew-x-[4deg] relative z-10 min-w-0 flex-1">
                <p className="text-white/60 group-hover:text-[var(--color-primary)] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-0.5">{item.label}</p>
                <p className="text-white group-hover:text-black font-bold text-sm md:text-base tracking-wide truncate">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Send Button */}
        <motion.button
          onClick={handleSendCallingCard}
          onMouseEnter={() => hoverSound?.play()}
          className="contact-item mt-2 bg-[var(--color-primary)] text-white font-black text-xl md:text-2xl uppercase tracking-widest py-4 border-[4px] border-white transform skew-x-[4deg] hard-shadow-white hover:bg-white hover:text-black transition-colors clickable relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 stripes-overlay opacity-30 pointer-events-none" />
          <span className="inline-block transform skew-x-[-4deg] relative z-10 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
            SEND CALLING CARD ▶
          </span>
        </motion.button>
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
            <Image src="/img/SVG/LOGO RN (FIX).svg" alt="RN Logo Watermark" fill className="object-contain" />
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

      {/* Right Column: Character & Calling Card */}
      <div className="absolute bottom-0 right-[-10%] md:right-[0%] w-[650px] md:w-[900px] h-[95%] md:h-[105%] z-10 character-contact pointer-events-none">
        <Image
          src="/img/WEBP/Karakter Rayhan 2 - persona 5.webp"
          alt="Rayhan"
          fill
          sizes="(max-width: 768px) 150vw, 100vw"
          className="object-contain object-bottom md:object-right-bottom drop-shadow-[0_0_20px_rgba(0,0,0,0.7)]"
          priority
        />

        {/* Floating Calling Card (Moved to Right Side) */}
        <motion.div
          className="calling-card absolute top-[25%] right-[5%] md:top-[15%] md:right-[5%] z-30 will-change-transform transform-gpu"
          animate={{ rotate: [6, 10, 6], y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="bg-[var(--color-primary)] border-[5px] border-white px-8 py-6 md:px-12 md:py-8 transform rotate-6 hard-shadow-white relative">
            <div className="absolute inset-0 stripes-overlay opacity-30" />
            <div className="absolute top-2 left-2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white opacity-90" />
            <div className="absolute top-2 right-2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white opacity-90" />
            <p className="persona-heading text-3xl md:text-5xl text-white text-center leading-[1.1] relative z-10 drop-shadow-[3px_3px_0_rgba(0,0,0,0.8)]">
              I'LL BE<br />WAITING!
            </p>
          </div>
        </motion.div>
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

      {/* Wipe Overlay Exit */}
      <div
        className="wipe-overlay-exit absolute top-0 bottom-0 left-[-50%] w-[150%] bg-[var(--color-primary)] z-[9999] pointer-events-none transform translate-x-full"
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
