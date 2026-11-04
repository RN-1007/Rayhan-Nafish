import React from 'react';
import type { Metadata } from 'next';
import PokemonGame from '@/components/game/PokemonGame';

export const metadata: Metadata = {
  title: 'Mini Game 2D - Rayhan Nafish',
  description: 'Interactive 2D Turn-based RPG mini-game built with pure HTML5 Canvas and React.',
};

export default function GamePage() {
  return (
    <main className="fixed inset-0 w-full h-full bg-[#0a0a0c] overflow-hidden">
      <PokemonGame />
    </main>
  );
}
