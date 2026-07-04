"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const skills = [
  { name: 'HTML / CSS', value: 90, color: '#D6001C' },
  { name: 'JavaScript', value: 80, color: '#D6001C' },
  { name: 'Python', value: 75, color: '#D6001C' },
  { name: 'Java', value: 70, color: '#D6001C' },
  { name: 'UI / UX Design', value: 65, color: '#D6001C' },
  { name: 'Git & GitHub', value: 90, color: '#D6001C' },
];

const toolsProficiency = [
  { name: 'React / Next.js', level: 'A+' },
  { name: 'Node.js', level: 'A' },
  { name: 'Tailwind CSS', level: 'A+' },
  { name: 'Figma', level: 'B+' },
  { name: 'TypeScript', level: 'A' },
  { name: 'PostgreSQL', level: 'B' },
];

export default function SkillsPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!pageRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo('.bg-persona', { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 })
      .fromTo('.skills-header', { x: -200, y: -50, opacity: 0, rotation: -15 }, { x: 0, y: 0, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4')
      .fromTo('.abilities-panel', { x: -100, opacity: 0, skewX: 20 }, { x: 0, opacity: 1, skewX: -4, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .fromTo('.tools-panel', { x: 100, opacity: 0, skewX: -20 }, { x: 0, opacity: 1, skewX: 2, duration: 0.5, ease: 'power3.out' }, '-=0.4')
      .fromTo('.skill-fill', { scaleX: 0 }, { scaleX: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', transformOrigin: 'left' }, '-=0.2')
      .fromTo('.tool-item', { y: 30, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.4')
      .fromTo('.star-deco', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.2');
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

      {/* Top Left: Skills Header Image */}
      <div className="absolute top-[2%] left-[2%] z-30 skills-header pointer-events-none w-[350px] md:w-[500px] h-[150px] md:h-[220px]">
        <Image
          src="/img/WEBP/SKILLS.webp"
          alt="Skills"
          fill
          className="object-contain object-top object-left drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
          priority
        />
      </div>

      {/* Left Column: Abilities (Stats) */}
      <div className="absolute top-[25%] md:top-[30%] left-[5%] z-20 abilities-panel pointer-events-auto">
        <div className="bg-black border-[4px] border-white p-6 md:p-8 w-[350px] md:w-[450px] transform skew-x-[-4deg] hard-shadow-red relative">
          <div className="absolute inset-0 stripes-overlay opacity-20 pointer-events-none" />
          
          <div className="transform skew-x-[4deg] relative z-10">
            {/* Title Badge */}
            <div className="bg-white px-4 py-1 inline-block border-[3px] border-black hard-shadow-white mb-6 transform -rotate-2">
              <span className="persona-heading text-black text-2xl">ABILITIES</span>
            </div>

            <div className="flex flex-col gap-5">
              {skills.map((skill) => (
                <div key={skill.name} className="flex items-center gap-3">
                  <span className="text-white font-bold text-sm md:text-base w-32 shrink-0 tracking-wider uppercase">{skill.name}</span>
                  <div className="flex-1 h-5 bg-white/20 border-2 border-black relative overflow-hidden transform skew-x-[-10deg]">
                    <div
                      className="skill-fill absolute inset-y-0 left-0 bg-[var(--color-primary)] border-r-4 border-white"
                      style={{ width: `${skill.value}%` }}
                    />
                    {/* Inner stripes */}
                    <div className="absolute inset-0 stripes-overlay opacity-50 pointer-events-none" />
                  </div>
                  <span className="text-white font-black text-sm md:text-base w-12 text-right drop-shadow-[2px_2px_0_rgba(214,0,28,1)]">{skill.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Tools Grid */}
      <div className="absolute top-[20%] md:top-[25%] right-[5%] z-20 tools-panel pointer-events-auto">
        <div className="bg-[var(--color-primary)] border-[4px] border-white p-6 md:p-8 w-[350px] md:w-[500px] transform skew-x-[2deg] hard-shadow relative">
          <div className="absolute inset-0 halftone-bg opacity-30 pointer-events-none" />
          
          <div className="transform skew-x-[-2deg] relative z-10">
            {/* Title Badge */}
            <div className="bg-black px-4 py-1 inline-block border-[3px] border-white hard-shadow-white mb-6 transform rotate-2">
              <span className="persona-heading text-white text-2xl">TOOLS & FRAMEWORKS</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {toolsProficiency.map((tool) => (
                <motion.div
                  key={tool.name}
                  className="tool-item bg-black border-2 border-white p-4 hover:bg-white hover:text-black transition-colors group clickable hard-shadow flex flex-col items-center text-center transform -skew-x-6"
                  whileHover={{ scale: 1.05, y: -5, rotate: -2 }}
                >
                  <p className="text-white group-hover:text-black font-black text-xs md:text-sm mb-2 uppercase tracking-widest">{tool.name}</p>
                  <p className={`persona-heading text-4xl md:text-5xl ${
                    tool.level.includes('+') ? 'text-[var(--color-primary)] group-hover:text-[var(--color-primary)]' : 'text-white group-hover:text-black'
                  } drop-shadow-[2px_2px_0_rgba(255,255,255,0.2)]`}>
                    {tool.level}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Component bottom right */}
        <motion.div 
          className="star-deco absolute -bottom-16 -right-8 md:-bottom-24 md:-right-12 z-30 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image src="/img/SVG/LOGO RN (FIX).svg" alt="RN Logo" fill className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
        </motion.div>
      </div>

      {/* Back Button */}
      <Link href="/" className="fixed bottom-6 left-[50%] -translate-x-1/2 md:left-6 md:translate-x-0 z-50 group">
        <motion.div 
          className="flex items-center gap-2 bg-black/90 border-2 border-white px-5 py-2 transform skew-x-[10deg] hard-shadow hover:bg-[var(--color-primary)] transition-colors clickable"
          whileHover={{ x: -5, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="transform skew-x-[-10deg] flex items-center gap-2">
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
