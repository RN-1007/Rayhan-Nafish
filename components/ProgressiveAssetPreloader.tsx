"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/* ─────────────────────────────────────────────────────────────
   PROGRESSIVE ASSET PRELOADER (ZERO-JANK BACKGROUND CACHING)
   Mendownload aset halaman lain secara bertahap saat browser idle,
   dengan tetap memprioritaskan 100% performa halaman aktif.
───────────────────────────────────────────────────────────── */

// Kelompok aset bertahap berdasarkan prioritas navigasi pengguna
const PRELOAD_TIERS = [
  // TIER 1: Halaman Prioritas Utama (About & Projects + Shared Background)
  {
    tier: 1,
    routes: ['/about', '/projects'],
    images: [
      '/img/WEBP/Background-persona 5.webp',
      '/img/WEBP/About me-persona 5.webp',
      '/img/WEBP/karakter Rayhan-persona 5.webp',
      '/img/WEBP/Projects-persona 5.webp',
      '/img/SVG/LOGO RN (FIX).svg',
    ],
    sounds: [
      '/sounds/back.mp3',
      '/sounds/hover.mp3',
      '/sounds/select.mp3',
    ],
  },
  // TIER 2: Halaman Sekunder (Skills & Contact)
  {
    tier: 2,
    routes: ['/skills', '/contact'],
    images: [
      '/img/WEBP/SKILLS.webp',
      '/img/WEBP/Contact.webp',
      '/img/WEBP/Karakter Rayhan 2 - persona 5.webp',
      '/img/SVG/LOGO RN (FIX) 1.svg',
    ],
    sounds: [],
  },
  // TIER 3: Mini Game Metaverse (Peta, Spritesheet Karakter, & Musuh)
  {
    tier: 3,
    routes: ['/game'],
    images: [
      '/game/map/map-ground.webp',
      '/game/map/map-overhead.png',
      '/game/player/player-walk.png',
      '/game/player/player-battle-back.png',
      '/game/battle/battle-bg.png',
      '/game/battle/battle-pedestial.png',
      '/game/enemies/enemy-shadow.png',
      '/game/enemies/enemy-reaper.png',
      '/game/enemies/enemy-mage.png',
    ],
    sounds: [],
  },
];

// Cache global memory agar aset tidak pernah di-download ulang
const cachedAssets = new Set<string>();

export default function ProgressiveAssetPreloader() {
  const router = useRouter();
  const isStartedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || isStartedRef.current) return;
    isStartedRef.current = true;

    let isCancelled = false;

    // Helper: Tunggu hingga browser benar-benar idle
    const runWhenIdle = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback, { timeout: 2500 });
      } else {
        setTimeout(callback, 300);
      }
    };

    // Helper: Preload gambar dan lakukan asinkron decode di background GPU
    const preloadImage = (src: string): Promise<void> => {
      if (cachedAssets.has(src)) return Promise.resolve();

      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          cachedAssets.add(src);
          if ('decode' in img) {
            img.decode().then(() => resolve()).catch(() => resolve());
          } else {
            resolve();
          }
        };
        img.onerror = () => {
          // Jangan hentikan antrean jika satu file bermasalah
          resolve();
        };
        img.src = src;
      });
    };

    // Helper: Preload audio buffer ke memori browser
    const preloadAudio = (src: string): Promise<void> => {
      if (cachedAssets.has(src)) return Promise.resolve();

      return new Promise((resolve) => {
        try {
          const audio = new Audio();
          audio.preload = 'auto';
          const onDone = () => {
            cachedAssets.add(src);
            resolve();
          };
          audio.addEventListener('canplaythrough', onDone, { once: true });
          audio.addEventListener('error', onDone, { once: true });
          audio.src = src;
          // Batas timeout agar tidak menggantung antrean
          setTimeout(onDone, 600);
        } catch {
          resolve();
        }
      });
    };

    // Helper: Jeda santai antar aset agar CPU thread tetap 100% mulus
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    // Eksekusi antrean bertahap (Staggered Progressive Pipeline)
    const startProgressivePreload = async () => {
      // 1. Tunda mulai awal 2 detik agar halaman aktif selesai rendering & transisi masuk
      await sleep(2000);
      if (isCancelled) return;

      for (const tier of PRELOAD_TIERS) {
        if (isCancelled) break;

        // Prefetch rute Next.js (RSC payload & JS chunk)
        for (const route of tier.routes) {
          if (isCancelled) break;
          try {
            router.prefetch(route);
          } catch {
            // Ignore prefetch error
          }
        }

        // Preload gambar satu per satu secara santai di background
        for (const imgSrc of tier.images) {
          if (isCancelled) break;
          await new Promise<void>((resolve) => {
            runWhenIdle(async () => {
              await preloadImage(imgSrc);
              await sleep(140); // Jeda 140ms antar file
              resolve();
            });
          });
        }

        // Preload audio
        for (const soundSrc of tier.sounds) {
          if (isCancelled) break;
          await new Promise<void>((resolve) => {
            runWhenIdle(async () => {
              await preloadAudio(soundSrc);
              await sleep(100);
              resolve();
            });
          });
        }

        // Jeda lebih panjang antar-tier (400ms) agar jaringan istirahat
        await sleep(400);
      }
    };

    // Jalankan pipeline saat window load selesai
    if (document.readyState === 'complete') {
      startProgressivePreload();
    } else {
      window.addEventListener('load', startProgressivePreload, { once: true });
    }

    return () => {
      isCancelled = true;
    };
  }, [router]);

  return null;
}

