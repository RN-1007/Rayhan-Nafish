"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!pageRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo('.bg-persona', 
      { scale: 1.1, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1 }
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
    .fromTo('.stat-bar-fill',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', transformOrigin: 'left' },
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

      {/* Character */}
      <div className="absolute bottom-0 right-[2%] md:right-[15%] w-[550px] h-[95vh] z-10 character-portrait pointer-events-none">
        <Image 
          src="/img/WEBP/karakter Rayhan-persona 5.webp" 
          alt="Rayhan" 
          fill 
          className="object-contain object-bottom"
          priority
        />
      </div>

      {/* Top Left: About Me Logo */}
      <div className="absolute top-[5%] left-[5%] z-30 about-header pointer-events-none w-[300px] md:w-[450px] h-[120px] md:h-[180px]">
        <Image
          src="/img/WEBP/About me-persona 5.webp"
          alt="About Me"
          fill
          className="object-contain object-top object-left drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
          priority
        />
      </div>

      {/* Middle Left: Bio Box */}
      <div className="absolute top-[30%] left-[5%] z-30 bio-box pointer-events-auto max-w-[400px]">
        <div className="bg-black border-[4px] border-white px-6 py-4 transform skew-x-[-4deg] hard-shadow relative">
          <div className="absolute inset-0 stripes-overlay opacity-20 pointer-events-none" />
          <div className="transform skew-x-[4deg]">
            <p className="text-white font-bold text-lg leading-snug mb-2 relative z-10">
              I'm <span className="text-[var(--color-primary)] text-xl persona-heading">Rayhan Nafish</span>.
            </p>
            <p className="text-white/90 text-sm font-semibold leading-relaxed relative z-10">
              A passionate developer who loves turning ideas into impactful digital solutions. My journey is all about pushing boundaries and exploring the unknown.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Left: STATUS Panel */}
      <div className="absolute bottom-[5%] left-[5%] z-30 status-box pointer-events-none">
        {/* Status Header Badge */}
        <div className="bg-white px-4 py-1 transform -rotate-3 mb-2 inline-block border-[3px] border-black hard-shadow-red relative z-10">
          <span className="persona-heading text-black text-3xl">STATUS</span>
        </div>
        
        {/* Status Container */}
        <div className="bg-black border-[3px] border-white p-5 w-[350px] md:w-[400px] transform -rotate-2 hard-shadow relative">
          <div className="absolute inset-0 stripes-overlay opacity-20 pointer-events-none" />
          <div className="flex flex-col gap-3 relative z-10">
            {stats.map((stat) => (
              <div key={stat.name} className="flex items-center gap-4">
                <span className="text-white font-bold text-sm w-32 shrink-0 tracking-wide">{stat.name}</span>
                <div className="flex-1 h-4 bg-white/20 border border-black relative overflow-hidden">
                  <div 
                    className="stat-bar-fill absolute inset-y-0 left-0 bg-[var(--color-primary)] border-r-2 border-white"
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
                <span className="text-white font-black text-sm w-6 text-right drop-shadow-[2px_2px_0_rgba(214,0,28,1)]">{stat.value}</span>
              </div>
            ))}
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
