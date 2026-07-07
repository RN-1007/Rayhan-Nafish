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

const projects = [
  {
    title: 'Personal Website',
    description: 'A responsive portfolio website built with modern web tech. Implements aggressive Persona 5 UI designs with GSAP animations.',
    tags: ['Next.js', 'GSAP', 'Tailwind'],
    status: 'COMPLETED',
  },
  {
    title: 'Task Manager App',
    description: 'A productivity app to manage tasks effectively with real-time sync and high performance backend.',
    tags: ['React', 'Node.js', 'Fullstack'],
    status: 'COMPLETED',
  },
  {
    title: 'Weather Dashboard',
    description: 'Real-time weather app using OpenWeather API with custom charting and responsive design.',
    tags: ['API', 'Chart.js', 'Tailwind'],
    status: 'COMPLETED',
  },
  {
    title: 'E-Commerce Clone',
    description: 'Full functioning online store with payment gateways, cart system, and admin dashboard.',
    tags: ['Next.js', 'Stripe', 'Prisma'],
    status: 'IN PROGRESS',
  },
  {
    title: 'Game Engine Tools',
    description: 'Scripting utilities and map editors for a 2D indie game project.',
    tags: ['C++', 'Python', 'Tools'],
    status: 'COMPLETED',
  },
];

export default function ProjectsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isWiping, setIsWiping] = useState(false);
  const [selectedProject, setSelectedProject] = useState(0);

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
        setSelectedProject((prev) => (prev + 1) % projects.length);
        hoverSound?.play();
      }
      if (e.key === 'ArrowUp' || e.key === 'w') {
        setSelectedProject((prev) => (prev - 1 + projects.length) % projects.length);
        hoverSound?.play();
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
      .fromTo('.projects-header', { x: -200, y: -50, opacity: 0, rotation: -15 }, { x: 0, y: 0, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4')
      .fromTo('.project-item', { x: -200, opacity: 0, skewX: 20 }, { x: 0, opacity: 1, skewX: -4, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.3')
      .fromTo('.project-detail', { x: 200, opacity: 0, skewX: -10 }, { x: 0, opacity: 1, skewX: 2, duration: 0.6, ease: 'back.out(1.2)' }, '-=0.4');
  }, { scope: pageRef });

  useEffect(() => {
    const el = document.getElementById(`project-${selectedProject}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedProject]);

  const current = projects[selectedProject];

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

      {/* Top Left: Projects Header Image */}
      <div className="absolute top-[2%] left-[-2%] z-30 projects-header pointer-events-none w-[350px] md:w-[500px] h-[150px] md:h-[220px]">
        <Image
          src="/img/WEBP/Projects-persona 5.webp"
          alt="Projects"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain object-top object-left drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
          priority
        />
      </div>

      <div className="absolute top-[25%] md:top-[30%] left-[5%] right-[5%] bottom-[10%] z-20 flex flex-col md:flex-row gap-8 md:gap-16">

        {/* Project List */}
        <div className="flex flex-col h-full w-full md:w-[450px] shrink-0">
          {/* Keyboard Hint */}
          <div className="hidden md:flex items-center gap-2 mb-4 ml-2">
            <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-white/40">↑↓ / W S</span>
            <span className="text-white/80 font-bold text-xs uppercase tracking-widest">Select Project</span>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden pr-4 custom-scrollbar pb-10">
            {projects.map((project, idx) => {
              const isActive = selectedProject === idx;
              return (
                <motion.div
                  key={project.title}
                  id={`project-${idx}`}
                  className="project-item cursor-pointer group clickable"
                  onMouseEnter={() => hoverSound?.play()}
                  onClick={() => setSelectedProject(idx)}
                  whileHover={{ x: 15 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`
                  flex items-center gap-4 px-6 py-4 border-[3px] transform skew-x-[-4deg] relative overflow-hidden hard-shadow transition-all duration-300
                  ${isActive
                      ? 'bg-black border-[var(--color-primary)]'
                      : 'bg-black/80 border-white/40 hover:border-white'
                    }
                `}>
                    {/* Stripes inside active */}
                    {isActive && <div className="absolute inset-0 stripes-overlay opacity-30 pointer-events-none" />}

                    <div className="transform skew-x-[4deg] flex items-center gap-4 w-full relative z-10">
                      {/* Index */}
                      <span className={`persona-heading text-3xl w-10 shrink-0 drop-shadow-[2px_2px_0_rgba(255,255,255,0.3)] ${isActive ? 'text-[var(--color-primary)]' : 'text-white/50'}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      {/* Title */}
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg md:text-xl uppercase tracking-wider ${isActive ? 'text-white' : 'text-white/80'}`}>{project.title}</h3>
                        <span className={`text-xs font-black uppercase tracking-[0.2em] ${project.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'
                          }`}>
                          {project.status}
                        </span>
                      </div>

                      {/* Arrow Indicator */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0, x: -20, scale: 0.5 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -10, scale: 0.5 }}
                            className="text-[var(--color-primary)] font-black text-2xl md:text-3xl drop-shadow-[0_0_10px_rgba(214,0,28,0.8)]"
                          >
                            ▶
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Project Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProject}
            initial={{ opacity: 0, x: 100, skewX: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, skewX: 2, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "backOut" }}
            className="project-detail flex-1 pointer-events-auto flex items-center"
          >
            <div className="bg-black border-[6px] border-white p-8 md:p-12 w-full transform skew-x-[2deg] hard-shadow relative">
              {/* Corner decor */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-[var(--color-primary)] rotate-45 opacity-20 pointer-events-none" />
              <div className="absolute inset-0 halftone-bg opacity-30 pointer-events-none" />

              <div className="transform skew-x-[-2deg] relative z-10 flex flex-col h-full justify-center">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h2 className="persona-heading text-5xl md:text-6xl text-white drop-shadow-[3px_3px_0_rgba(214,0,28,1)]">{current.title}</h2>

                  <span className={`px-4 py-1 text-sm font-black uppercase tracking-widest border-[3px] transform -rotate-2 ${current.status === 'COMPLETED'
                      ? 'border-green-500 text-green-500 hard-shadow-green'
                      : 'border-yellow-500 text-yellow-500 hard-shadow-yellow'
                    }`}>
                    {current.status}
                  </span>
                </div>

                <p className="text-white/90 font-semibold text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                  {current.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  {current.tags.map(tag => (
                    <span key={tag} className="bg-white text-black text-xs font-black px-4 py-2 uppercase tracking-widest transform -skew-x-6 hard-shadow hover:bg-[var(--color-primary)] hover:text-white transition-colors cursor-default">
                      #{tag}
                    </span>
                  ))}
                </div>

                <motion.button
                  className="self-start bg-[var(--color-primary)] text-white font-black text-lg px-8 py-4 uppercase tracking-widest border-[3px] border-white transform skew-x-[-10deg] hard-shadow clickable hover:bg-white hover:text-black transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="inline-block transform skew-x-[10deg]">
                    VIEW DETAILS ▶
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
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
        className="wipe-overlay-entrance absolute top-0 bottom-0 left-[-50%] w-[150%] bg-[var(--color-primary)] z-[9999] pointer-events-none transform translate-x-0"
        style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        <div className="absolute inset-0 stripes-overlay opacity-30 pointer-events-none" />
      </div>

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
