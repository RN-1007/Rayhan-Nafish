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

import certificates from '@/data/certificates.json';

const tabs = [
  { id: 'stats', label: 'COMBAT STATS', sub: 'Technical Abilities' },
  { id: 'tools', label: 'ARSENAL', sub: 'Tools & Frameworks' },
  { id: 'certs', label: 'TROPHIES', sub: 'Certificates & Awards' },
];

export default function SkillsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isWiping, setIsWiping] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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
      if (e.key === 'ArrowDown' || e.key === 's') {
        setActiveTab((prev) => (prev + 1) % tabs.length);
        hoverSound?.play();
      }
      if (e.key === 'ArrowUp' || e.key === 'w') {
        setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length);
        hoverSound?.play();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBack]);

  useGSAP(() => {
    if (!pageRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      gsap.set(['.skills-header', '.tab-item', '.content-panel', '.star-deco'], { opacity: 1, x: 0, y: 0, skewX: 0, rotation: 0, scale: 1 });
    } else {
      tl.fromTo('.skills-header', { x: -200, y: -50, opacity: 0, rotation: -15 }, { x: 0, y: 0, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.5)', delay: 0.2 })
        .fromTo('.tab-item', { x: -200, opacity: 0, skewX: 20 }, { x: 0, opacity: 1, skewX: -4, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.3')
        .fromTo('.content-panel', { x: 100, opacity: 0, skewX: -10 }, { x: 0, opacity: 1, skewX: 2, duration: 0.6, ease: 'backOut' }, '-=0.4')
        .fromTo('.star-deco', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.2');
    }
  }, { scope: pageRef });

  return (
    <div ref={pageRef} className="absolute inset-0 bg-black overflow-hidden">
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

      {/* Top Left: Skills Header Image */}
      <div className="absolute top-[2%] left-[-2%] z-30 skills-header pointer-events-none w-[350px] md:w-[500px] h-[150px] md:h-[220px]">
        <Image
          src="/img/WEBP/SKILLS.webp"
          alt="Skills"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain object-top object-left drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
          priority
        />
      </div>

      <div className="absolute top-[25%] md:top-[30%] left-[5%] right-[5%] bottom-[10%] z-20 flex flex-col md:flex-row gap-8 md:gap-16">

        {/* Left Column: Tab Menu */}
        <div className="flex flex-col h-full w-full md:w-[350px] shrink-0">
          {/* Keyboard Hint */}
          <div className="hidden md:flex items-center gap-2 mb-4 ml-2">
            <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-white/40">↑↓ / W S</span>
            <span className="text-white/80 font-bold text-xs uppercase tracking-widest">Select Category</span>
          </div>

          <div className="flex flex-col gap-4">
            {tabs.map((tab, idx) => {
              const isActive = activeTab === idx;
              return (
                <motion.div
                  key={tab.id}
                  className="tab-item cursor-pointer group clickable"
                  onMouseEnter={() => hoverSound?.play()}
                  onClick={() => setActiveTab(idx)}
                  whileHover={{ x: 15 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`
                    flex flex-col px-6 py-4 border-[3px] transform skew-x-[-4deg] relative overflow-hidden hard-shadow transition-all duration-300
                    ${isActive
                      ? 'bg-white border-white text-black'
                      : 'bg-black/80 border-white/40 text-white hover:border-white'
                    }
                  `}>
                    {isActive && <div className="absolute inset-0 halftone-bg opacity-20 pointer-events-none" />}
                    <div className="transform skew-x-[4deg] relative z-10">
                      <h3 className="persona-heading text-2xl md:text-3xl tracking-wider drop-shadow-sm">{tab.label}</h3>
                      <p className={`text-xs font-bold tracking-widest uppercase mt-1 ${isActive ? 'text-black' : 'text-[var(--color-primary)]'}`}>
                        {tab.sub}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Content Panel */}
        <div className="flex-1 content-panel pointer-events-auto h-full flex items-center">
          <div className="bg-black/90 border-[6px] border-[var(--color-primary)] p-8 md:p-10 w-full h-full md:h-auto md:max-h-full overflow-y-auto overflow-x-hidden custom-scrollbar transform skew-x-[2deg] hard-shadow relative">
            <div className="absolute inset-0 stripes-overlay opacity-20 pointer-events-none" />
            <div className="transform skew-x-[-2deg] relative z-10 h-full flex flex-col">

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 50, skewX: 10 }}
                  animate={{ opacity: 1, x: 0, skewX: 0 }}
                  exit={{ opacity: 0, x: -50, skewX: -10 }}
                  transition={{ duration: 0.3, ease: "backOut" }}
                  className="flex flex-col gap-6"
                >
                  {/* TAB 0: STATS */}
                  {activeTab === 0 && (
                    <>
                      <div className="bg-white px-4 py-2 inline-block border-[3px] border-black hard-shadow-white self-start transform -rotate-1 mb-2">
                        <span className="persona-heading text-black text-2xl">ABILITIES</span>
                      </div>
                      <div className="flex flex-col gap-5">
                        {skills.map((skill, i) => (
                          <motion.div
                            key={skill.name}
                            className="flex items-center gap-3"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                            style={{ transformOrigin: 'left' }}
                          >
                            <span className="text-white font-bold text-sm md:text-base w-32 shrink-0 tracking-wider uppercase">{skill.name}</span>
                            <div className="flex-1 h-6 bg-white/20 border-2 border-white relative overflow-hidden transform skew-x-[-10deg]">
                              <motion.div
                                className="absolute inset-y-0 left-0 bg-[var(--color-primary)] border-r-4 border-white"
                                initial={{ width: "0%" }}
                                animate={{ width: `${skill.value}%` }}
                                transition={{ duration: 0.8, delay: 0.2 + (i * 0.1), ease: "backOut" }}
                              />
                              <div className="absolute inset-0 stripes-overlay opacity-30 pointer-events-none" />
                            </div>
                            <span className="text-white font-black text-sm md:text-base w-12 text-right drop-shadow-[2px_2px_0_rgba(214,0,28,1)]">{skill.value}%</span>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* TAB 1: TOOLS */}
                  {activeTab === 1 && (
                    <>
                      <div className="bg-[var(--color-primary)] px-4 py-2 inline-block border-[3px] border-white hard-shadow self-start transform rotate-1 mb-2">
                        <span className="persona-heading text-white text-2xl">TOOLS & FRAMEWORKS</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {toolsProficiency.map((tool, i) => (
                          <motion.div
                            key={tool.name}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.05, ease: "backOut" }}
                            className="bg-black/50 border-2 border-[var(--color-primary)] p-4 hover:bg-[var(--color-primary)] hover:border-white transition-colors group clickable hard-shadow flex flex-col items-center text-center transform -skew-x-4"
                          >
                            <p className="text-white font-black text-xs md:text-sm mb-2 uppercase tracking-widest">{tool.name}</p>
                            <p className="persona-heading text-4xl md:text-5xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
                              {tool.level}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* TAB 2: CERTIFICATES */}
                  {activeTab === 2 && (
                    <>
                      <div className="bg-yellow-400 px-4 py-2 inline-block border-[3px] border-black hard-shadow-white self-start transform -rotate-2 mb-2">
                        <span className="persona-heading text-black text-2xl">TROPHIES & CERTS</span>
                      </div>
                      <div className="flex flex-col gap-4">
                        {certificates.map((cert, i) => (
                          <motion.div
                            key={cert.title}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.1, ease: "backOut" }}
                            className="flex items-center gap-4 bg-black/60 border-l-8 border-yellow-400 p-4 transform skew-x-[-2deg] hover:bg-black/80 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="text-white font-black text-lg md:text-xl uppercase tracking-wider">{cert.title}</h4>
                              <p className="text-white/70 font-bold text-xs uppercase tracking-widest mt-1">{cert.issuer}</p>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                              <span className="bg-white text-black text-[10px] font-black px-2 py-1 uppercase tracking-widest hard-shadow-sm mb-1">{cert.type}</span>
                              <span className="persona-heading text-[var(--color-primary)] text-2xl">{cert.date}</span>
                            </div>
                          </motion.div>
                        ))}

                        <div className="mt-4 p-4 border-2 border-dashed border-white/30 flex items-center justify-center transform skew-x-[2deg]">
                          <span className="text-white/50 font-bold uppercase tracking-widest text-sm">More certificates coming soon...</span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </div>

        {/* Decorative Component bottom right */}
        <motion.div
          className="star-deco absolute -bottom-12 -right-6 md:-bottom-20 md:-right-10 z-30 pointer-events-none will-change-transform transform-gpu"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image src="/img/SVG/LOGO RN (FIX).svg" alt="RN Logo" fill sizes="128px" className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
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
