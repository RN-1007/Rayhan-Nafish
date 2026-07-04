"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const contactInfo = [
  { icon: '✉', label: 'Email', value: 'rayhannafish@example.com', color: 'text-[var(--color-primary)]' },
  { icon: 'in', label: 'LinkedIn', value: 'linkedin.com/in/rayhannafish', color: 'text-blue-400' },
  { icon: '⌨', label: 'GitHub', value: 'github.com/rayhannafish', color: 'text-white' },
  { icon: '📍', label: 'Location', value: 'Indonesia', color: 'text-green-400' },
];

export default function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!pageRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo('.bg-persona', { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 })
      .fromTo('.contact-title', { x: -100, y: -50, opacity: 0, rotation: -10 }, { x: 0, y: 0, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4')
      .fromTo('.contact-item', { x: -150, opacity: 0, skewX: 20 }, { x: 0, opacity: 1, skewX: -4, duration: 0.4, stagger: 0.1, ease: 'power3.out' }, '-=0.3')
      .fromTo('.character-contact', { x: 100, y: 100, opacity: 0, scale: 0.8 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)' }, '-=0.4')
      .fromTo('.calling-card', { scale: 0, rotation: -40, opacity: 0 }, { scale: 1, rotation: 6, opacity: 1, duration: 0.6, ease: 'back.out(2)' }, '-=0.2');
  }, { scope: pageRef });

  return (
    <div ref={pageRef} className="fixed inset-0 bg-black overflow-hidden">
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
      <div className="absolute top-[5%] left-[5%] z-30 contact-title pointer-events-none">
        <div className="bg-black border-[4px] border-white px-8 py-4 transform skew-x-[-5deg] hard-shadow relative">
          <div className="absolute inset-0 stripes-overlay opacity-20" />
          <h1 className="persona-heading text-6xl md:text-8xl text-white relative z-10 transform skew-x-[5deg]">
            CONTACT<span className="text-[var(--color-primary)]"> ME</span>
          </h1>
        </div>
      </div>

      {/* Left Column: Contact Items */}
      <div className="absolute top-[25%] md:top-[28%] left-[5%] z-20 w-full max-w-[450px] flex flex-col gap-4 pointer-events-auto">
        <div className="contact-item bg-white px-4 py-2 inline-block border-[3px] border-black hard-shadow-white mb-2 transform -rotate-2 w-max">
          <span className="persona-heading text-black text-2xl">LET'S WORK TOGETHER!</span>
        </div>

        {contactInfo.map((item) => (
          <motion.div
            key={item.label}
            className="contact-item bg-black border-[3px] border-white p-4 flex items-center gap-5 transform skew-x-[-4deg] hard-shadow group clickable relative overflow-hidden transition-colors hover:bg-white"
            whileHover={{ x: 15, skewX: -2 }}
          >
            <div className="absolute inset-0 stripes-overlay opacity-10 pointer-events-none group-hover:opacity-5" />
            
            {/* Icon */}
            <div className={`w-14 h-14 bg-black border-2 border-white flex items-center justify-center transform -skew-x-6 text-2xl font-black ${item.color} shrink-0 relative z-10 shadow-[4px_4px_0_0_rgba(255,255,255,0.4)] group-hover:shadow-[4px_4px_0_0_var(--color-primary)]`}>
              <span className="skew-x-6 drop-shadow-md">{item.icon}</span>
            </div>

            {/* Info */}
            <div className="transform skew-x-[4deg] relative z-10">
              <p className="text-white/60 group-hover:text-black/60 text-xs font-black uppercase tracking-[0.2em] mb-1">{item.label}</p>
              <p className="text-white group-hover:text-black font-bold text-base md:text-lg tracking-wide">{item.value}</p>
            </div>
          </motion.div>
        ))}

        {/* Send Button */}
        <motion.button
          className="contact-item mt-4 bg-[var(--color-primary)] text-white font-black text-xl uppercase tracking-widest py-5 border-[4px] border-white transform skew-x-[4deg] hard-shadow-white hover:bg-white hover:text-black transition-colors clickable relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 stripes-overlay opacity-30 pointer-events-none" />
          <span className="inline-block transform skew-x-[-4deg] relative z-10">
            SEND CALLING CARD ▶
          </span>
        </motion.button>
      </div>

      {/* Right Column: Character & Calling Card */}
      <div className="absolute bottom-0 right-[2%] md:right-[10%] w-[500px] h-[85vh] z-10 character-contact pointer-events-none">
        <Image 
          src="/img/WEBP/karakter Rayhan-persona 5.webp" 
          alt="Rayhan" 
          fill 
          className="object-contain object-bottom"
          priority
        />

        {/* Floating Calling Card */}
        <motion.div
          className="calling-card absolute top-[10%] -left-[20%] z-30"
          animate={{ rotate: [6, 10, 6], y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="bg-[var(--color-primary)] border-[5px] border-white px-10 py-8 transform rotate-6 hard-shadow relative">
            <div className="absolute inset-0 stripes-overlay opacity-30" />
            <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-white opacity-80" />
            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white opacity-80" />
            <p className="persona-heading text-4xl md:text-5xl text-white text-center leading-[1.1] relative z-10 drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
              I'LL BE<br />WAITING!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Back Button */}
      <Link href="/" className="fixed bottom-6 left-[50%] -translate-x-1/2 md:left-6 md:translate-x-0 z-50 group">
        <motion.div 
          className="flex items-center gap-2 bg-black/90 border-2 border-white px-5 py-2 transform skew-x-[-10deg] hard-shadow hover:bg-[var(--color-primary)] transition-colors clickable"
          whileHover={{ x: -5, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="transform skew-x-[10deg] flex items-center gap-2">
            <span className="text-white font-black text-xl">◀</span>
            <span className="text-white font-bold text-sm md:text-base uppercase tracking-widest persona-heading">BACK TO MENU</span>
          </div>
        </motion.div>
      </Link>

      {/* Scanline */}
      <div className="absolute inset-0 z-40 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
      }} />
    </div>
  );
}
