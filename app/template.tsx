"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Template({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(wipeRef.current, { xPercent: 0, skewX: 0 });

    const tl = gsap.timeline();

    // Red wipe slides right with sharp trailing edge
    // Delay slightly (0.2s) to allow Next.js hydration to finish on Android, avoiding CPU bottleneck/frame drops
    tl.to(wipeRef.current, {
      xPercent: 120,
      skewX: -20,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(wipeRef.current, { autoAlpha: 0 });
      }
    }, 0.2);

    // Content scales in slightly (without opacity fade so internal wipes are visible)
    gsap.fromTo(container.current,
      { scale: 1.03 },
      { scale: 1, duration: 0.4, ease: 'power2.out', delay: 0.3 }
    );
  }, { scope: container });

  return (
    <>
      {/* Red Wipe */}
      <div
        ref={wipeRef}
        className="absolute inset-0 z-[100] bg-[var(--color-primary)] pointer-events-none origin-left"
      />

      <div ref={container} className="relative w-full h-full">
        {children}
      </div>
    </>
  );
}
