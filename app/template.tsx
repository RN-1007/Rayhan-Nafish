"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Template({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(wipeRef.current, { xPercent: 0, skewX: 0 });
    gsap.set(flashRef.current, { autoAlpha: 1 });

    const tl = gsap.timeline();

    // White flash
    tl.to(flashRef.current, {
      autoAlpha: 0,
      duration: 0.08,
      ease: 'power4.out',
    }, 0);

    // Red wipe slides right with sharp trailing edge
    tl.to(wipeRef.current, {
      xPercent: 120,
      skewX: -20,
      duration: 0.45,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(wipeRef.current, { autoAlpha: 0 });
      }
    }, 0.08);

    // Content scales in slightly (without opacity fade so internal wipes are visible)
    gsap.fromTo(container.current,
      { scale: 1.03 },
      { scale: 1, duration: 0.25, ease: 'power2.out', delay: 0.15 }
    );
  }, { scope: container });

  return (
    <>
      {/* Red Wipe */}
      <div
        ref={wipeRef}
        className="absolute inset-0 z-[100] bg-[var(--color-primary)] pointer-events-none origin-left"
      />

      {/* White Flash */}
      <div
        ref={flashRef}
        className="absolute inset-0 z-[110] bg-white pointer-events-none"
      />

      <div ref={container} className="relative w-full h-full">
        {children}
      </div>
    </>
  );
}
