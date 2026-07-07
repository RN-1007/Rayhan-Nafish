"use client";

import { useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.25);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const soundRef = useRef<Howl | null>(null);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  useEffect(() => {
    let isMounted = true;
    let loadedAssets = 0;
    
    // Daftar aset berat yang HARUS didownload sebelum web dibuka
    const criticalImages = [
      '/img/WEBP/karakter Rayhan-persona 5.webp',
      '/img/WEBP/Background-persona 5.webp',
      '/img/SVG/LOGO RN (FIX) 1.svg',
      '/img/WEBP/loading_lets go-persona 5.webp'
    ];
    
    const totalAssets = criticalImages.length + 1; // +1 untuk lagu Jamiroquai

    const handleAssetLoaded = () => {
      if (!isMounted) return;
      loadedAssets += 1;
      // Jika semua gambar dan audio sudah sukses terdownload
      if (loadedAssets >= totalAssets) {
        setIsReady(true);
      }
    };

    // Mulai mendownload semua gambar secara background
    criticalImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
      img.onload = handleAssetLoaded;
      img.onerror = handleAssetLoaded; // Tetap lanjut jika gagal agar user tidak terjebak selamanya
    });

    // Mulai mendownload Audio
    soundRef.current = new Howl({
      src: ['/sounds/jamiroquai-cosmic-girl.mp3'],
      loop: true,
      volume: musicVolume,
      html5: true,
      onload: handleAssetLoaded,
      onloaderror: handleAssetLoaded,
      // Do NOT autoplay here to respect the overlay. Wait for handleStart.
    });

    // Fallback: Jika setelah 10 detik entah kenapa ada error jaringan, buka saja paksa (UX safety)
    const fallbackTimer = setTimeout(() => {
      if (isMounted) setIsReady(true);
    }, 10000);

    // Cleanup
    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
      soundRef.current?.unload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = () => {
    if (!isPlaying) {
      soundRef.current?.play();
      setIsPlaying(true);
    }
    setShowOverlay(false);
  };

  const togglePlay = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMusicVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMusicVolume(val);
    if (soundRef.current) {
      soundRef.current.volume(val);
    }
  };

  const handleSfxVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSfxVolume(val);
    // Simpan ke local storage agar bisa digunakan oleh komponen lain nantinya
    if (typeof window !== 'undefined') {
      localStorage.setItem('sfxVolume', val.toString());
      window.dispatchEvent(new CustomEvent('sfxVolumeChange', { detail: val }));
    }
  };

  // Hanya tampilkan UI tombol di halaman Home, kecuali overlay awal yang muncul di mana pun
  if (pathname !== '/' && !showOverlay) return null;

  return (
    <>
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed inset-0 z-[90] bg-black flex flex-col items-center justify-center ${isReady ? 'cursor-pointer' : 'cursor-wait'}`}
            onClick={isReady ? handleStart : undefined}
          >
            <Image 
              src="/img/WEBP/loading_lets go-persona 5.webp"
              alt="Loading Background"
              fill
              className="object-cover opacity-60 mix-blend-luminosity"
              priority
            />
            <div className="absolute inset-0 stripes-overlay opacity-30 pointer-events-none" />
            <motion.div
              className="bg-[var(--color-primary)] border-[5px] border-white px-10 py-6 transform skew-x-[-10deg] hard-shadow-white relative z-10"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <h1 className="persona-heading text-white text-3xl md:text-5xl text-center drop-shadow-[3px_3px_0_rgba(0,0,0,0.8)]">
                USE HEADPHONES FOR<br />BETTER EXPERIENCE
              </h1>
            </motion.div>
            <p className="text-white mt-8 font-black tracking-[0.3em] text-sm md:text-base uppercase relative z-10 bg-black/50 px-4 py-2 border-2 border-white">
              {isReady ? (
                <span className="animate-pulse">[ CLICK TO CONTINUE ]</span>
              ) : (
                <span className="inline-block animate-bounce">LOADING ASSETS...</span>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {pathname === '/' && !showOverlay && (
        <div ref={panelRef} className="fixed top-4 right-4 md:top-8 md:right-8 z-[9999] flex flex-col items-end">
          {/* Settings Toggle Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-12 h-12 bg-black border-[3px] border-white flex items-center justify-center transform skew-x-[-5deg] hard-shadow group hover:bg-[var(--color-primary)] transition-colors clickable"
          >
            <span className="text-white text-xl transform skew-x-[5deg]">
              ⚙️
            </span>
          </button>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mt-4 bg-white border-[4px] border-black p-5 w-[280px] transform skew-x-[-2deg] hard-shadow relative"
              >
                <div className="absolute inset-0 stripes-overlay opacity-10 pointer-events-none" />

                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="persona-heading text-2xl text-black">AUDIO CONFIG</h3>
                  <button onClick={() => setShowSettings(false)} className="text-black font-bold text-lg hover:text-[var(--color-primary)]">✖</button>
                </div>

                <div className="flex flex-col gap-5 relative z-10">
                  {/* Music Play/Pause */}
                  <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
                    <span className="font-bold text-sm uppercase tracking-wider text-black">BGM Control</span>
                    <button
                      onClick={togglePlay}
                      className={`border-2 border-black px-4 py-1.5 font-black text-xs transition-colors transform skew-x-[-5deg] ${isPlaying ? 'bg-black text-white hover:bg-[var(--color-primary)]' : 'bg-white text-black hover:bg-gray-200'}`}
                    >
                      <span className="inline-block transform skew-x-[5deg]">{isPlaying ? 'STOP ⬛' : 'PLAY ▶'}</span>
                    </button>
                  </div>

                  {/* Music Volume Slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs uppercase text-gray-700">Music Vol</span>
                      <span className="text-xs font-black bg-black text-white px-2 py-0.5 transform skew-x-[-5deg]">{Math.round(musicVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0" max="1" step="0.05"
                      value={musicVolume}
                      onChange={handleMusicVolume}
                      className="w-full accent-[var(--color-primary)] cursor-pointer"
                    />
                  </div>

                  {/* SFX Volume Slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs uppercase text-gray-700">SFX Vol</span>
                      <span className="text-xs font-black bg-black text-white px-2 py-0.5 transform skew-x-[-5deg]">{Math.round(sfxVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0" max="1" step="0.05"
                      value={sfxVolume}
                      onChange={handleSfxVolume}
                      className="w-full accent-[var(--color-primary)] cursor-pointer"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
