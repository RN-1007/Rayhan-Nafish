"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CalendarWidget({ position = 'top-left' }: { position?: 'top-left' | 'top-right' }) {
  const [dateInfo, setDateInfo] = useState({ month: '01', day: '01', weekday: 'MON' });
  const [weather, setWeather] = useState({ temp: '--', code: 0 });

  useEffect(() => {
    // Current Date
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const weekday = days[now.getDay()];
    setDateInfo({ month, day, weekday });

    // Weather API (Madiun, ID coordinates)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-7.6298&longitude=111.5239&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data && data.current_weather) {
          setWeather({
            temp: Math.round(data.current_weather.temperature).toString(),
            code: data.current_weather.weathercode,
          });
        }
      })
      .catch(err => console.error("Weather fetch error", err));
  }, []);

  // Simple weather code to icon mapper
  const getWeatherIcon = (code: number) => {
    if (code === 0) return '☀️'; // Clear
    if (code >= 1 && code <= 3) return '⛅'; // Partly cloudy
    if (code >= 45 && code <= 48) return '🌫️'; // Fog
    if (code >= 51 && code <= 67) return '🌧️'; // Rain
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code >= 95 && code <= 99) return '⛈️'; // Thunderstorm
    return '🌡️'; // Default
  };

  const posClass = position === 'top-right' 
    ? 'top-4 right-4 md:top-8 md:right-8' 
    : 'top-4 left-4 md:top-8 md:left-8';

  const initialX = position === 'top-right' ? 30 : -30;

  return (
    <motion.div 
      className={`absolute ${posClass} z-50 pointer-events-none flex items-start`}
      initial={{ opacity: 0, x: initialX, skewX: 10 }}
      animate={{ opacity: 1, x: 0, skewX: 0 }}
      transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
    >
      {/* Date Box */}
      <div className="bg-black border-[3px] border-white px-4 py-1.5 md:px-5 md:py-2 transform skew-x-[-10deg] hard-shadow-white relative z-10">
        <div className="absolute inset-0 stripes-overlay opacity-20" />
        <div className="flex items-center gap-3 relative z-10 transform skew-x-[10deg]">
          <span className="persona-heading text-3xl md:text-5xl text-white drop-shadow-[2px_2px_0_var(--color-primary)]">
            {dateInfo.month}<span className="text-[var(--color-primary)] ml-1 mr-1">/</span>{dateInfo.day}
          </span>
          <div className="bg-[var(--color-primary)] border-2 border-white px-2 py-0.5">
            <span className="text-white font-black text-xs md:text-sm tracking-widest">{dateInfo.weekday}</span>
          </div>
        </div>
      </div>

      {/* Weather Box */}
      <div className="bg-white border-y-[3px] border-r-[3px] border-black px-3 py-1.5 md:px-4 md:py-2 transform skew-x-[-10deg] -ml-3 mt-2 md:mt-3 hard-shadow relative z-0">
        <div className="flex items-center gap-2 transform skew-x-[10deg]">
          <span className="text-xl md:text-2xl drop-shadow-sm">{getWeatherIcon(weather.code)}</span>
          <span className="font-black text-black text-sm md:text-base">{weather.temp}°C</span>
        </div>
      </div>
    </motion.div>
  );
}
