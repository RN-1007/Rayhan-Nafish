"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, RotateCcw } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   TYPES & CONSTANTS
───────────────────────────────────────────────────────────── */

type Direction = 'down' | 'left' | 'right' | 'up';
type GameState = 'OVERWORLD' | 'ALERT' | 'TRANSITION' | 'BATTLE';
type BattlePhase =
  | 'INTRO'
  | 'PLAYER_MENU'
  | 'SKILL_MENU'
  | 'PLAYER_ATTACKING'
  | 'ENEMY_ATTACKING'
  | 'VICTORY'
  | 'DEFEAT'
  | 'RUN_AWAY';

interface MageSkill {
  id: string;
  name: string;
  element: 'FIRE' | 'ICE' | 'LIGHTNING' | 'ARCANE';
  badge: string;
  minDamage: number;
  maxDamage: number;
  color: string;
  description: string;
  castMessage: string;
}

const MAGE_SKILLS: MageSkill[] = [
  {
    id: 'agi_flare',
    name: 'AGI FLARE',
    element: 'FIRE',
    badge: 'FIRE ✦',
    minDamage: 32,
    maxDamage: 44,
    color: '#FF3D00',
    description: 'Menembakkan pilar api berkobar membakar musuh',
    castMessage: 'Rayhan merapal Agi Flare! Pilar api membakar musuh!',
  },
  {
    id: 'bufu_nova',
    name: 'BUFU NOVA',
    element: 'ICE',
    badge: 'ICE ❄',
    minDamage: 28,
    maxDamage: 40,
    color: '#00E5FF',
    description: 'Ledakan kristal es glasial membekukan bayangan musuh',
    castMessage: 'Rayhan merapal Bufu Nova! Ledakan kristal es menghantam musuh!',
  },
  {
    id: 'zio_bolt',
    name: 'ZIO BOLT',
    element: 'LIGHTNING',
    badge: 'ELEC ⚡',
    minDamage: 36,
    maxDamage: 50,
    color: '#FFEA00',
    description: 'Sambaran kilat petir bertegangan tinggi yang menyengat',
    castMessage: 'Rayhan memanggil Zio Bolt! Sambaran petir dahsyat menyengat musuh!',
  },
  {
    id: 'megido_arcana',
    name: 'MEGIDO ARCANA',
    element: 'ARCANE',
    badge: 'ULTRA ★',
    minDamage: 48,
    maxDamage: 65,
    color: '#D500F9',
    description: 'Sihir kosmik gravitasi pamungkas pemusnah dimensi',
    castMessage: 'Rayhan membangkitkan Megido Arcana! Ledakan kosmik dahsyat melenyapkan musuh!',
  },
];

interface EnemyData {
  id: string;
  name: string;
  title: string;
  level: number;
  maxHp: number;
  currentHp: number;
  imageSrc: string;
  attacks: { name: string; power: number; desc: string }[];
}

const TILE_SIZE = 32;
const MAP_COLS = 18;
const MAP_ROWS = 13;
const MAP_WIDTH = MAP_COLS * TILE_SIZE; // 576 px
const MAP_HEIGHT = MAP_ROWS * TILE_SIZE; // 416 px

// Kecepatan jalan santai, pelan, dan sangat tenang (piksel per frame 60 FPS)
const WALK_SPEED = 1.35;

// Siklus ayunan langkah natural: Netral (1) -> Kaki Kiri (0) -> Netral (1) -> Kaki Kanan (2)
const WALK_CYCLE = [1, 0, 1, 2];
const STEP_DISTANCE = 11; // Pergantian frame setiap menempuh 11 piksel (sinkron dengan langkah)

interface Hitbox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/*
  Hitbox Presisi (Pixel-Accurate) untuk setiap obstacle visual di peta Shibuya (576x416):
  Tidak lagi memakai kotak kaku 32px, melainkan ukuran fisik nyata objek di layar!
*/
const OBSTACLE_HITBOXES: Hitbox[] = [
  // 1. Gedung Melengkung Kiri Atas (Gaya Shibuya 109 - Fasad kaca presisi)
  { id: 'bldg_top_left_1', x: 0, y: 0, w: 70, h: 128 },
  { id: 'bldg_top_left_2', x: 70, y: 0, w: 72, h: 136 },

  // 2. Area Gang Antara Gedung & Stasiun (Lorong kini terbuka dan bisa dijelajahi!)
  { id: 'alley_back_wall', x: 142, y: 0, w: 88, h: 48 },
  { id: 'alley_small_tree', x: 146, y: 92, w: 20, h: 36 },

  // 3. Stasiun Shibuya (渋谷駅 - Area dalam rel/atap & pilar gerbang tiket)
  { id: 'station_roof', x: 230, y: 0, w: 146, h: 78 },
  { id: 'station_pillar_left', x: 230, y: 78, w: 35, h: 18 },
  { id: 'station_pillar_right', x: 345, y: 78, w: 35, h: 18 },

  // 3. Gedung Kanan Atas (Banner Topeng Joker, Bangku Taman & Vending Machine)
  { id: 'bldg_top_right', x: 455, y: 0, w: 121, h: 155 },
  { id: 'tree_top_right_bench', x: 380, y: 0, w: 75, h: 115 },
  { id: 'vending_machine', x: 500, y: 155, w: 55, h: 65 },

  // 4. Monumen Patung Perak & Semak Bunga Merah Tengah Plaza (Presisi Penuh)
  { id: 'center_monument', x: 282, y: 176, w: 158, h: 76 },

  // 5. Pot Pohon & Papan Informasi Plaza
  // Pot kotak pohon kiri tengah (dasar pot kayu di lantai plaza)
  { id: 'tree_mid_left_planter', x: 210, y: 252, w: 42, h: 27 },
  // Pulau pot pohon kanan tengah + papan denah rute + tempat sampah
  { id: 'tree_mid_right_island', x: 365, y: 234, w: 70, h: 28 },

  // 6. Railing Pagar & Pembatas Proyek Konstruksi Plaza
  // Pagar lereng turunan kiri
  { id: 'railing_left_ramp', x: 0, y: 212, w: 75, h: 36 },
  // Pagar horizontal kiri dekat penyeberangan
  { id: 'railing_left_plaza', x: 75, y: 248, w: 57, h: 12 },
  // Pagar pembatas tangga tengah plaza
  { id: 'railing_mid_stairs', x: 260, y: 276, w: 78, h: 12 },
  // Palang konstruksi garis kuning-hitam & kerucut oranye
  { id: 'barrier_construction', x: 342, y: 278, w: 56, h: 26 },
  // Tumpukan peti kargo merah
  { id: 'red_crates', x: 400, y: 270, w: 42, h: 34 },
  // Pagar pembatas plaza sisi kanan
  { id: 'railing_right_plaza', x: 448, y: 278, w: 50, h: 12 },

  // 7. Gedung Modern Kiri Bawah (Atap teras & dinding jendela kaca menyala)
  { id: 'bldg_bot_left', x: 0, y: 310, w: 102, h: 106 },

  // 8. Gedung Kanan Bawah & Pohon Trotoar
  { id: 'bldg_bot_right_facade', x: 445, y: 348, w: 131, h: 68 },
  { id: 'tree_bot_right', x: 506, y: 330, w: 70, h: 86 },

  // 9. Tiang-tiang Lampu Jalan (Hanya area tapak/kaki tiang di lantai: 8-10 px)
  { id: 'lamp_stairs', x: 220, y: 198, w: 8, h: 10 },
  { id: 'lamp_left_plaza', x: 102, y: 294, w: 8, h: 10 },
  { id: 'lamp_bot_left', x: 118, y: 392, w: 8, h: 10 },
  { id: 'lamp_bot_mid', x: 238, y: 396, w: 8, h: 10 },
  { id: 'lamp_bot_right', x: 396, y: 396, w: 8, h: 10 },
  { id: 'lamp_right_plaza', x: 462, y: 312, w: 8, h: 10 },
];

/*
  Zona Distorsi Merah Metaverse (Area pemicu encounter battle yang sinkron):
*/
const ENCOUNTER_ZONES: Hitbox[] = [
  // 1. Bercak distorsi merah di aspal jalan sisi kiri
  { id: 'enc_left_road', x: 0, y: 195, w: 95, h: 65 },
  // 2. Retakan distorsi kognitif merah besar di aspal jalan (digeser ke atas menutupi noda merah visual, bebas dari tiang lampu)
  { id: 'enc_bottom_rift', x: 225, y: 280, w: 185, h: 60 },
  // 3. Bercak distorsi merah di aspal jalan sisi kanan
  { id: 'enc_right_road', x: 440, y: 270, w: 70, h: 60 },
];

const ENEMY_ROSTER = [
  {
    id: 'shadow',
    name: 'SHADOW PHANTOM',
    title: 'Shadow of Cognitive Distortions',
    level: 5,
    maxHp: 85,
    imageSrc: '/game/enemies/enemy-shadow.png',
    attacks: [
      { name: 'Null Pointer Glitch', power: 14, desc: 'menembakkan serpihan kode error!' },
      { name: 'Memory Leak', power: 18, desc: 'menguras energi dan stamina!' },
      { name: 'Mind Corruption', power: 22, desc: 'memicu kepanikan sprint!' },
    ],
  },
  {
    id: 'reaper',
    name: 'REAPER OF DEADLINE',
    title: 'Harbinger of Unfinished Sprints',
    level: 7,
    maxHp: 110,
    imageSrc: '/game/enemies/enemy-reaper.png',
    attacks: [
      { name: 'Midnight Revisi', power: 16, desc: 'mengirim chat revisi dadakan!' },
      { name: 'Scope Creep Scythe', power: 22, desc: 'menebas dengan tumpukan tugas baru!' },
      { name: 'Panic Execution', power: 26, desc: 'memicu stres jelang rilis!' },
    ],
  },
  {
    id: 'mage',
    name: 'ERROR MAGE',
    title: 'Architect of Overflow Layouts',
    level: 6,
    maxHp: 95,
    imageSrc: '/game/enemies/enemy-mage.png',
    attacks: [
      { name: 'CSS Z-Index War', power: 15, desc: 'menutupi tombol krusial!' },
      { name: 'Broken Pipeline', power: 20, desc: 'menggagalkan proses build server!' },
      { name: 'Infinite Recursion', power: 24, desc: 'membuat browser tidak merespons!' },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   CHIPTUNE & SFX SYNTHESIZER (WEB AUDIO API)
───────────────────────────────────────────────────────────── */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playStep() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playDistortion() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playAlert() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(920, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  playGlassShatter() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    [320, 480, 720, 1050, 1400].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.04);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime + i * 0.04);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.04 + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.04);
      osc.stop(this.ctx.currentTime + i * 0.04 + 0.1);
    });
  }

  playSelect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, this.ctx.currentTime);
    osc.frequency.setValueAtTime(900, this.ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  playSlash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  playHit() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playVictory() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.12 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.12);
      osc.stop(this.ctx.currentTime + i * 0.12 + 0.2);
    });
  }

  playMagicCast(element: 'FIRE' | 'ICE' | 'LIGHTNING' | 'ARCANE') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    if (element === 'FIRE') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } else if (element === 'ICE') {
      [750, 1100, 1550].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.04);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.04 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.04);
        osc.stop(this.ctx.currentTime + i * 0.04 + 0.2);
      });
    } else if (element === 'LIGHTNING') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(920, this.ctx.currentTime);
      osc.frequency.setValueAtTime(280, this.ctx.currentTime + 0.06);
      osc.frequency.setValueAtTime(780, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.24, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.26);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } else {
      [380, 580, 880, 1300].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.05 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.05);
        osc.stop(this.ctx.currentTime + i * 0.05 + 0.25);
      });
    }
  }
}

const sounds = new SoundEngine();

/* ─────────────────────────────────────────────────────────────
   MAIN FULLSCREEN GAME COMPONENT
───────────────────────────────────────────────────────────── */

export default function PokemonGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sound & Status States
  const [isMuted, setIsMuted] = useState(false);
  const [gameState, setGameState] = useState<GameState>('OVERWORLD');
  const [playerHp, setPlayerHp] = useState(100);
  const [maxPlayerHp] = useState(100);
  const [battlesWon, setBattlesWon] = useState(0);
  const [showHitboxes, setShowHitboxes] = useState(false);
  const showHitboxesRef = useRef(false);
  showHitboxesRef.current = showHitboxes;

  // Smooth Continuous Player State
  const playerRef = useRef({
    x: 290, // Muncul di tengah plaza Shibuya (bebas rintangan)
    y: 130,
    vx: 0,
    vy: 0,
    direction: 'down' as Direction,
    isMoving: false,
    walkDistance: 0,
    walkFrame: 1, // 0: left, 1: idle/pass, 2: right
    lastStepSoundDist: 0,
    encounterStepDist: 0,
  });

  // Smooth Interpolated Camera State
  const cameraRef = useRef({
    x: 290,
    y: 130,
  });

  // Keyboard Keys Held State Tracker (Eliminates OS repeat stutter!)
  const keysHeld = useRef<Record<string, boolean>>({});

  // Floating Touch Joystick State (Mobile / Android / Pointer Support)
  const joystickRef = useRef<{
    active: boolean;
    touchId: number | null;
    baseX: number;
    baseY: number;
    currX: number;
    currY: number;
    vectorX: number;
    vectorY: number;
  }>({
    active: false,
    touchId: null,
    baseX: 0,
    baseY: 0,
    currX: 0,
    currY: 0,
    vectorX: 0,
    vectorY: 0,
  });
  const isPointerDownRef = useRef(false);

  // Battle State
  const [currentEnemy, setCurrentEnemy] = useState<EnemyData | null>(null);
  const [battlePhase, setBattlePhase] = useState<BattlePhase>('INTRO');
  const [battleMessage, setBattleMessage] = useState<string>('');
  const [selectedActionIndex, setSelectedActionIndex] = useState<number>(0); // 0: ATTACK, 1: RUN
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number>(0); // 0: Agi, 1: Bufu, 2: Zio, 3: Megido
  const lastSpellColorRef = useRef<string>('#D6001C');

  // Visual Effects Refs
  const transitionRef = useRef({ progress: 0 });
  const shakeRef = useRef(0);
  const enemyFlashRef = useRef(0);
  const playerFlashRef = useRef(0);
  const floatTickRef = useRef(0);

  // Asset Images Cache Ref
  const imagesRef = useRef<{
    mapGround: HTMLImageElement | null;
    mapOverhead: HTMLImageElement | null;
    playerWalk: HTMLImageElement | null;
    battleBg: HTMLImageElement | null;
    battlePedestal: HTMLImageElement | null;
    playerBattleBack: HTMLImageElement | null;
    enemyImages: Record<string, HTMLImageElement>;
  }>({
    mapGround: null,
    mapOverhead: null,
    playerWalk: null,
    battleBg: null,
    battlePedestal: null,
    playerBattleBack: null,
    enemyImages: {},
  });

  // Toggle Mute
  const toggleMute = () => {
    sounds.enabled = isMuted;
    setIsMuted(!isMuted);
  };

  /* ─── PRELOAD GAME ASSETS ─── */
  useEffect(() => {
    const loadImg = (src: string) => {
      const img = new Image();
      img.src = src;
      return img;
    };

    imagesRef.current.mapGround = loadImg('/game/map/map-ground.webp');
    imagesRef.current.mapOverhead = loadImg('/game/map/map-overhead.png');
    imagesRef.current.playerWalk = loadImg('/game/player/player-walk.png');
    imagesRef.current.battleBg = loadImg('/game/battle/battle-bg.png');
    imagesRef.current.battlePedestal = loadImg('/game/battle/battle-pedestial.png');
    imagesRef.current.playerBattleBack = loadImg('/game/player/player-battle-back.png');

    imagesRef.current.enemyImages = {
      shadow: loadImg('/game/enemies/enemy-shadow.png'),
      reaper: loadImg('/game/enemies/enemy-reaper.png'),
      mage: loadImg('/game/enemies/enemy-mage.png'),
    };
  }, []);

  /* ─── TRIGGER BATTLE ─── */
  const triggerBattle = useCallback(() => {
    sounds.playAlert();
    setGameState('ALERT');

    setTimeout(() => {
      sounds.playGlassShatter();
      transitionRef.current.progress = 0;
      setGameState('TRANSITION');

      const template = ENEMY_ROSTER[Math.floor(Math.random() * ENEMY_ROSTER.length)];
      const spawnedEnemy: EnemyData = {
        id: template.id,
        name: template.name,
        title: template.title,
        level: template.level,
        maxHp: template.maxHp,
        currentHp: template.maxHp,
        imageSrc: template.imageSrc,
        attacks: template.attacks,
      };

      setCurrentEnemy(spawnedEnemy);

      setTimeout(() => {
        setGameState('BATTLE');
        setBattlePhase('INTRO');
        setBattleMessage(`WASPADA! ${spawnedEnemy.name} menghalangi jalan!`);
        setSelectedActionIndex(0);
      }, 1000);
    }, 380);
  }, []);

  /* ─── BATTLE ACTION: ENEMY TURN ─── */
  const triggerEnemyTurn = useCallback(() => {
    if (!currentEnemy) return;
    setBattlePhase('ENEMY_ATTACKING');

    const randAttack = currentEnemy.attacks[Math.floor(Math.random() * currentEnemy.attacks.length)];
    setBattleMessage(`${currentEnemy.name} ${randAttack.desc}`);

    setTimeout(() => {
      sounds.playHit();
      playerFlashRef.current = 10;
      shakeRef.current = 8;

      const dmg = Math.floor(randAttack.power + (Math.random() * 6 - 3));
      setPlayerHp((prev) => {
        const nextHp = Math.max(0, prev - dmg);
        if (nextHp <= 0) {
          setTimeout(() => {
            setBattlePhase('DEFEAT');
            setBattleMessage('Rayhan tumbang kehabisan energi...');
            setTimeout(() => {
              playerRef.current.x = 256;
              playerRef.current.y = 110;
              setPlayerHp(100);
              setGameState('OVERWORLD');
            }, 2400);
          }, 700);
        } else {
          setTimeout(() => {
            setBattlePhase('PLAYER_MENU');
            setBattleMessage('PILIH AKSI KAMU:');
          }, 1000);
        }
        return nextHp;
      });
    }, 800);
  }, [currentEnemy]);

  /* ─── BATTLE ACTION: EXECUTE MAGE SKILL ─── */
  const executeSkill = useCallback(
    (skill: MageSkill) => {
      if (!currentEnemy) return;
      sounds.playMagicCast(skill.element);
      lastSpellColorRef.current = skill.color;
      setBattlePhase('PLAYER_ATTACKING');
      setBattleMessage(skill.castMessage);

      setTimeout(() => {
        sounds.playHit();
        enemyFlashRef.current = 12;
        shakeRef.current = skill.element === 'ARCANE' ? 14 : 9;

        const damage = Math.floor(
          skill.minDamage + Math.random() * (skill.maxDamage - skill.minDamage + 1)
        );
        const remainingHp = Math.max(0, currentEnemy.currentHp - damage);

        setCurrentEnemy((prev) => (prev ? { ...prev, currentHp: remainingHp } : null));
        setBattleMessage(`Serangan telak! ${skill.name} menghasilkan ${damage} magic damage ke ${currentEnemy.name}!`);

        setTimeout(() => {
          if (remainingHp <= 0) {
            sounds.playVictory();
            setBattlePhase('VICTORY');
            setBattleMessage(`VICTORY! ${currentEnemy.name} musnah terurai oleh sihir Metaverse!`);
            setBattlesWon((w) => w + 1);

            setTimeout(() => {
              setGameState('OVERWORLD');
              setBattlePhase('INTRO');
            }, 2200);
          } else {
            triggerEnemyTurn();
          }
        }, 1200);
      }, 650);
    },
    [currentEnemy, triggerEnemyTurn]
  );

  /* ─── BATTLE ACTION: RUN ─── */
  const executeRun = useCallback(() => {
    sounds.playSelect();
    setBattlePhase('RUN_AWAY');
    setBattleMessage('Rayhan berhasil menyelinap kabur dari bayangan!');

    setTimeout(() => {
      setGameState('OVERWORLD');
      setBattlePhase('INTRO');
    }, 1200);
  }, []);

  /* ─── KEYBOARD LISTENERS (CONTINUOUS STATE TRACKING) ─── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysHeld.current[key] = true;

      // Toggle Debug Hitbox dengan tombol [H]
      if (key === 'h') {
        setShowHitboxes((prev) => !prev);
      }

      // Battle Action Keys
      if (gameState === 'BATTLE') {
        if (battlePhase === 'INTRO') {
          if (e.key === 'Enter' || e.key === ' ' || key === 'e') {
            sounds.playSelect();
            setBattlePhase('PLAYER_MENU');
            setBattleMessage('PILIH AKSI KAMU:');
          }
        } else if (battlePhase === 'PLAYER_MENU') {
          if (key === 'a' || e.key === 'ArrowLeft') {
            sounds.playStep();
            setSelectedActionIndex(0);
          } else if (key === 'd' || e.key === 'ArrowRight') {
            sounds.playStep();
            setSelectedActionIndex(1);
          } else if (e.key === 'Enter' || e.key === ' ' || key === 'e') {
            if (selectedActionIndex === 0) {
              sounds.playSelect();
              setBattlePhase('SKILL_MENU');
              setBattleMessage('PILIH SPELL SIHIR MAGE:');
              setSelectedSkillIndex(0);
            } else {
              executeRun();
            }
          }
        } else if (battlePhase === 'SKILL_MENU') {
          if (e.key === 'Escape' || key === 'q' || e.key === 'Backspace') {
            sounds.playSelect();
            setBattlePhase('PLAYER_MENU');
            setBattleMessage('PILIH AKSI KAMU:');
          } else if (key === 'a' || e.key === 'ArrowLeft') {
            sounds.playStep();
            setSelectedSkillIndex((prev) => (prev % 2 === 1 ? prev - 1 : prev));
          } else if (key === 'd' || e.key === 'ArrowRight') {
            sounds.playStep();
            setSelectedSkillIndex((prev) => (prev % 2 === 0 && prev < 3 ? prev + 1 : prev));
          } else if (key === 'w' || e.key === 'ArrowUp') {
            sounds.playStep();
            setSelectedSkillIndex((prev) => (prev >= 2 ? prev - 2 : prev));
          } else if (key === 's' || e.key === 'ArrowDown') {
            sounds.playStep();
            setSelectedSkillIndex((prev) => (prev <= 1 ? prev + 2 : prev));
          } else if (e.key === 'Enter' || e.key === ' ' || key === 'e') {
            const skill = MAGE_SKILLS[selectedSkillIndex];
            if (skill) {
              executeSkill(skill);
            }
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysHeld.current[key] = false;
    };

    const handleBlur = () => {
      keysHeld.current = {};
      isPointerDownRef.current = false;
      joystickRef.current.active = false;
      joystickRef.current.touchId = null;
      joystickRef.current.vectorX = 0;
      joystickRef.current.vectorY = 0;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [gameState, battlePhase, selectedActionIndex, selectedSkillIndex, executeSkill, executeRun]);

  /* ─── SUB-PIXEL COLLISION TESTER (HITBOX PRESISI 100% SINKRON) ─── */
  const isSolidAt = (boxX: number, boxY: number, boxW: number, boxH: number): boolean => {
    // 1. Cek batas tepi peta terluar
    if (boxX < 0 || boxX + boxW > MAP_WIDTH || boxY < 0 || boxY + boxH > MAP_HEIGHT) {
      return true;
    }

    // 2. Cek tabrakan terhadap setiap hitbox obstacle visual
    for (let i = 0; i < OBSTACLE_HITBOXES.length; i++) {
      const ob = OBSTACLE_HITBOXES[i];
      if (
        boxX < ob.x + ob.w &&
        boxX + boxW > ob.x &&
        boxY < ob.y + ob.h &&
        boxY + boxH > ob.y
      ) {
        return true;
      }
    }
    return false;
  };

  /* ─── FULLSCREEN CANVAS GAME LOOP (60 FPS) ─── */
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      floatTickRef.current += 0.05;

      // ── UPDATE PHYSICS & FLUID MOVEMENT IN OVERWORLD ──
      if (gameState === 'OVERWORLD') {
        const p = playerRef.current;
        const keys = keysHeld.current;
        const joy = joystickRef.current;

        let inputX = 0;
        let inputY = 0;

        if (joy.active && (Math.abs(joy.vectorX) > 0 || Math.abs(joy.vectorY) > 0)) {
          inputX = joy.vectorX;
          inputY = joy.vectorY;
        } else {
          if (keys['w'] || keys['arrowup']) inputY -= 1;
          if (keys['s'] || keys['arrowdown']) inputY += 1;
          if (keys['a'] || keys['arrowleft']) inputX -= 1;
          if (keys['d'] || keys['arrowright']) inputX += 1;

          // Diagonal normalization
          if (inputX !== 0 && inputY !== 0) {
            inputX *= 0.7071;
            inputY *= 0.7071;
          }
        }

        const vx = inputX * WALK_SPEED;
        const vy = inputY * WALK_SPEED;

        // Feet bounding box dimensions for realistic collision
        const FEET_OFFSET_X = 9;
        const FEET_OFFSET_Y = 32;
        const FEET_W = 18;
        const FEET_H = 10;

        // Smooth axis-separated movement (allows natural wall sliding!)
        let movedDist = 0;
        if (vx !== 0) {
          const nextX = p.x + vx;
          if (!isSolidAt(nextX + FEET_OFFSET_X, p.y + FEET_OFFSET_Y, FEET_W, FEET_H)) {
            p.x = nextX;
            movedDist += Math.abs(vx);
          }
        }

        if (vy !== 0) {
          const nextY = p.y + vy;
          if (!isSolidAt(p.x + FEET_OFFSET_X, nextY + FEET_OFFSET_Y, FEET_W, FEET_H)) {
            p.y = nextY;
            movedDist += Math.abs(vy);
          }
        }

        // Clamp to map borders
        p.x = Math.max(0, Math.min(MAP_WIDTH - 36, p.x));
        p.y = Math.max(0, Math.min(MAP_HEIGHT - 44, p.y));

        // Update direction
        if (Math.abs(vy) > Math.abs(vx) && Math.abs(vy) > 0.05) {
          p.direction = vy > 0 ? 'down' : 'up';
        } else if (Math.abs(vx) > 0.05) {
          p.direction = vx > 0 ? 'right' : 'left';
        }

        // Natural walk animation cycle
        if (movedDist > 0) {
          p.isMoving = true;
          p.walkDistance += movedDist;

          // Cycle: 1 (neutral) -> 0 (left step) -> 1 (neutral) -> 2 (right step)
          const cycleIdx = Math.floor(p.walkDistance / STEP_DISTANCE) % 4;
          p.walkFrame = WALK_CYCLE[cycleIdx];

          // Play subtle rhythmic step sound
          if (p.walkDistance - p.lastStepSoundDist >= STEP_DISTANCE * 2) {
            p.lastStepSoundDist = p.walkDistance;
            sounds.playStep();
          }

          // Cek Zona Distorsi Merah Metaverse di bawah tapak kaki
          const feetCenterX = p.x + 18;
          const feetCenterY = p.y + 36;
          const inEncounterZone = ENCOUNTER_ZONES.some(
            (z) =>
              feetCenterX >= z.x &&
              feetCenterX <= z.x + z.w &&
              feetCenterY >= z.y &&
              feetCenterY <= z.y + z.h
          );

          if (inEncounterZone) {
            p.encounterStepDist += movedDist;
            if (p.encounterStepDist >= 35) {
              p.encounterStepDist = 0;
              sounds.playDistortion();
              if (Math.random() < 0.16) {
                triggerBattle();
              }
            }
          }
        } else {
          // Standing still -> instantly return to natural neutral idle stance!
          p.isMoving = false;
          p.walkFrame = 1;
        }

        // Smooth Camera Gliding (Lerp Interpolation)
        const cam = cameraRef.current;
        cam.x += (p.x - cam.x) * 0.08;
        cam.y += (p.y - cam.y) * 0.08;
      } else {
        if (joystickRef.current.active) {
          joystickRef.current.active = false;
          joystickRef.current.touchId = null;
          joystickRef.current.vectorX = 0;
          joystickRef.current.vectorY = 0;
        }
      }

      // ── RENDERING ──
      ctx.save();
      ctx.fillStyle = '#050507';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Screen Shake
      if (shakeRef.current > 0) {
        const sx = (Math.random() - 0.5) * shakeRef.current;
        const sy = (Math.random() - 0.5) * shakeRef.current;
        ctx.translate(sx, sy);
        shakeRef.current = Math.max(0, shakeRef.current - 0.5);
      }

      if (gameState === 'OVERWORLD' || gameState === 'ALERT') {
        renderOverworld(ctx, canvas);
      } else if (gameState === 'TRANSITION') {
        renderOverworld(ctx, canvas);
        renderTransition(ctx, canvas);
      } else if (gameState === 'BATTLE') {
        renderBattle(ctx, canvas);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    /* ── SUB-RENDER: OVERWORLD WITH SMOOTH CAMERA LERP ── */
    const renderOverworld = (c: CanvasRenderingContext2D, cvs: HTMLCanvasElement) => {
      const p = playerRef.current;
      const cam = cameraRef.current;

      // Close-up cinematic zoom (responsive for desktop, mobile landscape, and mobile portrait)
      const isPortrait = cvs.height > cvs.width;
      const zoom = isPortrait
        ? Math.max(1.6, Math.min(2.4, cvs.width / 200))
        : Math.max(1.8, Math.min(3.2, cvs.height / 240));
      const viewW = cvs.width / zoom;
      const viewH = cvs.height / zoom;

      // Camera centered on smoothly interpolated coordinates
      let camX = cam.x + 18 - viewW / 2;
      let camY = cam.y + 22 - viewH / 2;

      // Clamp camera so no black void outside map
      const maxCamX = Math.max(0, MAP_WIDTH - viewW);
      const maxCamY = Math.max(0, MAP_HEIGHT - viewH);
      camX = Math.max(0, Math.min(maxCamX, camX));
      camY = Math.max(0, Math.min(maxCamY, camY));

      c.save();
      c.scale(zoom, zoom);
      c.translate(-camX, -camY);

      // 1. LAYER BAWAH: Ground Map
      const groundImg = imagesRef.current.mapGround;
      if (groundImg && groundImg.complete) {
        c.drawImage(groundImg, 0, 0, MAP_WIDTH, MAP_HEIGHT);
      } else {
        c.fillStyle = '#1c1c1c';
        c.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
      }

      // 2. PLAYER SPRITE (Smoothly rendered with 3-frame spritesheet)
      drawPlayerWalkSprite(c, p.x, p.y, p.direction, p.walkFrame);

      // 3. LAYER ATAS: Overhead Map (tiang lampu & pohon menutupi karakter secara alami!)
      const overheadImg = imagesRef.current.mapOverhead;
      if (overheadImg && overheadImg.complete) {
        c.drawImage(overheadImg, 0, 0, MAP_WIDTH, MAP_HEIGHT);
      }

      // Alert [!] Persona bubble
      if (gameState === 'ALERT') {
        c.fillStyle = '#D6001C';
        c.fillRect(p.x + 7, p.y - 24, 22, 22);
        c.strokeStyle = '#FFFFFF';
        c.lineWidth = 2;
        c.strokeRect(p.x + 7, p.y - 24, 22, 22);
        c.fillStyle = '#FFFFFF';
        c.font = 'bold 16px monospace';
        c.fillText('!', p.x + 14, p.y - 7);
      }

      // 4. DEBUG HITBOX OVERLAY (Visualisasi Garis Pembatas Presisi)
      if (showHitboxesRef.current) {
        // Obstacle padat (Merah transparan dengan border)
        c.fillStyle = 'rgba(255, 0, 50, 0.35)';
        c.strokeStyle = '#FF1744';
        c.lineWidth = 1;
        OBSTACLE_HITBOXES.forEach((ob) => {
          c.fillRect(ob.x, ob.y, ob.w, ob.h);
          c.strokeRect(ob.x, ob.y, ob.w, ob.h);
        });

        // Zona pemicu musuh (Oranye transparan)
        c.fillStyle = 'rgba(255, 140, 0, 0.28)';
        c.strokeStyle = '#FFB300';
        c.lineWidth = 1;
        ENCOUNTER_ZONES.forEach((z) => {
          c.fillRect(z.x, z.y, z.w, z.h);
          c.strokeRect(z.x, z.y, z.w, z.h);
        });

        // Tapak kaki karakter pemain (Cyan terang)
        c.fillStyle = 'rgba(0, 255, 255, 0.85)';
        c.fillRect(p.x + 9, p.y + 32, 18, 10);
      }

      c.restore();

      // 5. FLOATING DYNAMIC JOYSTICK (Persona 5 Touch Control)
      const joy = joystickRef.current;
      if (joy.active) {
        c.save();

        // Outer Translucent Dark Plate
        c.beginPath();
        c.arc(joy.baseX, joy.baseY, 54, 0, Math.PI * 2);
        c.fillStyle = 'rgba(15, 5, 8, 0.55)';
        c.fill();
        c.lineWidth = 2.5;
        c.strokeStyle = '#D6001C';
        c.stroke();

        // Outer stylish dashed boundary ring
        c.beginPath();
        c.arc(joy.baseX, joy.baseY, 60, 0, Math.PI * 2);
        c.setLineDash([4, 6]);
        c.lineWidth = 1.5;
        c.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        c.stroke();
        c.setLineDash([]);

        // 4 Cardinal Direction Crosshairs
        const ticks = [
          [0, -54],
          [54, 0],
          [0, 54],
          [-54, 0],
        ];
        c.fillStyle = '#FFFFFF';
        ticks.forEach(([tx, ty]) => {
          c.beginPath();
          c.arc(joy.baseX + tx, joy.baseY + ty, 2.5, 0, Math.PI * 2);
          c.fill();
        });

        // Dynamic Connecting Laser
        c.beginPath();
        c.moveTo(joy.baseX, joy.baseY);
        c.lineTo(joy.currX, joy.currY);
        c.lineWidth = 3;
        c.strokeStyle = 'rgba(255, 42, 77, 0.7)';
        c.stroke();

        // Floating Thumb Nub
        c.beginPath();
        c.arc(joy.currX, joy.currY, 22, 0, Math.PI * 2);
        c.fillStyle = '#D6001C';
        c.fill();
        c.lineWidth = 2.5;
        c.strokeStyle = '#FFFFFF';
        c.stroke();

        // Inner white dot
        c.beginPath();
        c.arc(joy.currX, joy.currY, 4.5, 0, Math.PI * 2);
        c.fillStyle = '#FFFFFF';
        c.fill();

        c.restore();
      }
    };

    /* ── DRAW PLAYER SPRITESHEET (PRECISE FRAME SLICING) ── */
    const drawPlayerWalkSprite = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      dir: Direction,
      frame: number
    ) => {
      const walkImg = imagesRef.current.playerWalk;

      if (walkImg && walkImg.complete && walkImg.width > 0) {
        const frameW = walkImg.width / 3;
        const frameH = walkImg.height / 4;

        let row = 0;
        if (dir === 'down') row = 0;
        else if (dir === 'up') row = 1;
        else if (dir === 'left') row = 2;
        else if (dir === 'right') row = 3;

        const col = frame; // 0 (left step), 1 (neutral idle), 2 (right step)

        const sx = col * frameW;
        const sy = row * frameH;

        // Render target size
        const dw = 36;
        const dh = 44;

        // Soft feet shadow
        c.fillStyle = 'rgba(0,0,0,0.38)';
        c.beginPath();
        c.ellipse(x + dw / 2, y + dh - 2, dw / 2.6, 4.5, 0, 0, Math.PI * 2);
        c.fill();

        c.drawImage(walkImg, sx, sy, frameW, frameH, x, y, dw, dh);
      } else {
        c.fillStyle = '#D6001C';
        c.fillRect(x + 4, y + 4, 28, 36);
      }
    };

    /* ── SUB-RENDER: SCREEN TRANSITION (SHATTER FLASH) ── */
    const renderTransition = (c: CanvasRenderingContext2D, cvs: HTMLCanvasElement) => {
      transitionRef.current.progress += 1;
      const prog = transitionRef.current.progress;

      if (prog < 16) {
        c.fillStyle = prog % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(214,0,28,0.85)';
        c.fillRect(0, 0, cvs.width, cvs.height);
      } else {
        const factor = Math.min(1, Math.max(0, (prog - 16) / 32));
        const maxDim = Math.max(cvs.width, cvs.height) * 1.2;
        const radius = Math.max(0, maxDim * (1 - factor));

        c.fillStyle = '#000000';
        if (radius <= 0) {
          c.fillRect(0, 0, cvs.width, cvs.height);
        } else {
          c.beginPath();
          c.arc(cvs.width / 2, cvs.height / 2, radius, 0, Math.PI * 2);
          c.rect(cvs.width, 0, -cvs.width, cvs.height);
          c.fill();
        }
      }
    };

    /* ── SUB-RENDER: IMMERSIVE FULLSCREEN BATTLE ── */
    const renderBattle = (c: CanvasRenderingContext2D, cvs: HTMLCanvasElement) => {
      const W = cvs.width;
      const H = cvs.height;

      // 1. Battle Background (Cover full screen)
      const bg = imagesRef.current.battleBg;
      if (bg && bg.complete) {
        const scale = Math.max(W / bg.width, H / bg.height);
        const bw = bg.width * scale;
        const bh = bg.height * scale;
        c.drawImage(bg, (W - bw) / 2, (H - bh) / 2, bw, bh);
      } else {
        c.fillStyle = '#111';
        c.fillRect(0, 0, W, H);
      }

      // Vignette
      c.fillStyle = 'rgba(0, 0, 0, 0.25)';
      c.fillRect(0, 0, W, H);

      const pedestalImg = imagesRef.current.battlePedestal;

      // 2. ENEMY SECTION (Top Right)
      const enemyX = W * 0.70;
      const enemyY = H * 0.32;
      const enemyScale = Math.min(W * 0.28, 280);

      // Enemy Pedestal
      if (pedestalImg && pedestalImg.complete) {
        const pw = enemyScale * 1.5;
        const ph = pw * (pedestalImg.height / pedestalImg.width);
        c.drawImage(pedestalImg, enemyX - pw / 2, enemyY + enemyScale * 0.45, pw, ph);
      }

      // Enemy Floating Sprite
      if (currentEnemy) {
        const enemyImg = imagesRef.current.enemyImages[currentEnemy.id];
        const floatY = Math.sin(floatTickRef.current * 2) * 8;

        if (enemyImg && enemyImg.complete) {
          if (enemyFlashRef.current > 0) {
            enemyFlashRef.current -= 1;
            if (Math.floor(enemyFlashRef.current) % 2 === 0) {
              c.filter = 'brightness(3) saturate(0)';
            }
          }
          c.drawImage(
            enemyImg,
            enemyX - enemyScale / 2,
            enemyY - enemyScale / 2 + floatY,
            enemyScale,
            enemyScale
          );
          c.filter = 'none';
        }

        // Enemy HUD Box (Top Left)
        const hudW = Math.min(280, Math.max(180, W * 0.50));
        drawPersonaHudBox(
          c,
          Math.max(16, W * 0.05),
          Math.max(24, H * 0.08),
          hudW,
          72,
          currentEnemy.name,
          currentEnemy.level,
          currentEnemy.currentHp,
          currentEnemy.maxHp,
          false
        );
      }

      // 3. PLAYER SECTION (Bottom Left)
      const playerX = W * 0.28;
      const playerY = H * 0.62;
      const playerScale = Math.min(W * 0.32, 320);

      // Player Pedestal
      if (pedestalImg && pedestalImg.complete) {
        const pw = playerScale * 1.4;
        const ph = pw * (pedestalImg.height / pedestalImg.width);
        c.drawImage(pedestalImg, playerX - pw / 2, playerY + playerScale * 0.38, pw, ph);
      }

      // Player Back Sprite
      const playerBackImg = imagesRef.current.playerBattleBack;
      if (playerBackImg && playerBackImg.complete) {
        if (playerFlashRef.current > 0) {
          playerFlashRef.current -= 1;
          if (Math.floor(playerFlashRef.current) % 2 === 0) {
            c.filter = 'brightness(3) saturate(0)';
          }
        }
        c.drawImage(
          playerBackImg,
          playerX - playerScale / 2,
          playerY - playerScale / 2,
          playerScale,
          playerScale
        );
        c.filter = 'none';
      }

      // Player HUD Box (Mid-Right)
      const playerHudW = Math.min(280, Math.max(180, W * 0.50));
      drawPersonaHudBox(
        c,
        Math.max(16, Math.min(W - playerHudW - 16, W * 0.60)),
        Math.max(H * 0.44, playerY - 45),
        playerHudW,
        72,
        'RAYHAN (DEV)',
        7,
        playerHp,
        maxPlayerHp,
        true
      );

      // 4. BOTTOM BATTLE PANEL (HANYA 2 TOMBOL: ATTACK & RUN)
      drawPersonaBattlePanel(c, W, H);
    };

    /* ── DRAW PERSONA HUD STATUS BOX ── */
    const drawPersonaHudBox = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      name: string,
      level: number,
      hp: number,
      maxHp: number,
      isPlayer: boolean
    ) => {
      c.save();
      c.translate(x, y);

      // Shadow
      c.fillStyle = '#000000';
      c.beginPath();
      c.moveTo(6, 6);
      c.lineTo(w + 6, 6);
      c.lineTo(w - 14, h + 6);
      c.lineTo(-14, h + 6);
      c.closePath();
      c.fill();

      // Background
      c.fillStyle = isPlayer ? '#1A1A1A' : '#D6001C';
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(w, 0);
      c.lineTo(w - 20, h);
      c.lineTo(-20, h);
      c.closePath();
      c.fill();

      // Border
      c.strokeStyle = '#FFFFFF';
      c.lineWidth = 3;
      c.stroke();

      // Text Header
      c.fillStyle = '#FFFFFF';
      c.font = '900 16px sans-serif';
      c.fillText(name, 10, 24);

      c.fillStyle = '#FFEA00';
      c.font = 'bold 13px monospace';
      c.fillText(`LV.${level}`, w - 75, 24);

      // HP Bar
      const barX = 10;
      const barY = 36;
      const barW = w - 45;
      const barH = 14;

      c.fillStyle = '#000000';
      c.fillRect(barX, barY, barW, barH);

      const pct = Math.max(0, Math.min(1, hp / maxHp));
      let hpColor = '#00FFA3';
      if (pct < 0.25) hpColor = '#FF1744';
      else if (pct < 0.55) hpColor = '#FFEA00';

      c.fillStyle = hpColor;
      c.fillRect(barX + 2, barY + 2, (barW - 4) * pct, barH - 4);

      c.fillStyle = '#FFFFFF';
      c.font = 'bold 11px monospace';
      c.fillText(`${hp} / ${maxHp} HP`, barX + barW - 75, barY + 24);

      c.restore();
    };

    /* ── DRAW BOTTOM BATTLE PANEL (HANYA 2 TOMBOL: ATTACK & RUN) ── */
    const drawPersonaBattlePanel = (c: CanvasRenderingContext2D, W: number, H: number) => {
      const isNarrow = W < 680;
      const panelH = isNarrow ? Math.min(150, Math.max(120, H * 0.25)) : Math.min(130, H * 0.20);
      const panelY = H - panelH;

      // Bottom bar background
      c.fillStyle = '#000000';
      c.fillRect(0, panelY, W, panelH);
      c.strokeStyle = '#D6001C';
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(0, panelY);
      c.lineTo(W, panelY);
      c.stroke();

      // Left Area: Dialogue Box Message
      c.fillStyle = '#FFFFFF';
      c.font = isNarrow ? 'bold 15px monospace' : 'bold 18px monospace';

      if (battlePhase === 'INTRO') {
        c.fillText(battleMessage, 20, panelY + 45);
        c.fillStyle = '#FFEA00';
        c.font = isNarrow ? 'bold 12px monospace' : 'bold 14px monospace';
        c.fillText(isNarrow ? '▶ Sentuh layar untuk bersiap!' : '▶ Tekan [ENTER] / [SPASI] untuk bersiap bertarung!', 20, panelY + 75);
        return;
      }

      if (battlePhase === 'PLAYER_ATTACKING' || battlePhase === 'ENEMY_ATTACKING' || battlePhase === 'VICTORY' || battlePhase === 'DEFEAT' || battlePhase === 'RUN_AWAY') {
        c.fillText(battleMessage, 20, panelY + 65);
        return;
      }

      if (battlePhase === 'PLAYER_MENU') {
        if (isNarrow) {
          c.fillText(battleMessage, 16, panelY + 28);

          const btnW = Math.max(130, (W - 36) / 2);
          const btnH = panelH - 42;
          const btnY = panelY + 36;
          const btn1X = 14;
          const btn2X = 14 + btnW + 8;

          drawActionButton(c, btn1X, btnY, btnW, btnH, 'MAGIC ATTACK', '✦ SIHIR MAGE', selectedActionIndex === 0, '#D6001C');
          drawActionButton(c, btn2X, btnY, btnW, btnH, 'RUN', '⚡ KABUR', selectedActionIndex === 1, '#222226');
        } else {
          c.fillText(battleMessage, 40, panelY + 45);
          c.fillStyle = '#999';
          c.font = '12px monospace';
          c.fillText('Gunakan [A] [D] untuk memilih • [ENTER] untuk Buka Spell Sihir', 40, panelY + 75);

          const btnW = Math.min(220, W * 0.22);
          const btnH = panelH - 30;
          const btnY = panelY + 15;
          const btn1X = W - btnW * 2 - 40;
          const btn2X = W - btnW - 20;

          drawActionButton(c, btn1X, btnY, btnW, btnH, 'MAGIC ATTACK', '✦ BUKA SIHIR MAGE', selectedActionIndex === 0, '#D6001C');
          drawActionButton(c, btn2X, btnY, btnW, btnH, 'RUN', '⚡ KABUR CEPAT', selectedActionIndex === 1, '#222226');
        }
        return;
      }

      // In SKILL_MENU: 4 Mage Spells Selection Submenu
      if (battlePhase === 'SKILL_MENU') {
        const curSkill = MAGE_SKILLS[selectedSkillIndex] || MAGE_SKILLS[0];

        if (!isNarrow) {
          // Left Panel: Spell Info & Elemental Styling
          c.fillStyle = curSkill.color;
          c.font = '900 20px sans-serif';
          c.fillText(`[ ${curSkill.badge} ] ${curSkill.name}`, 40, panelY + 38);

          c.fillStyle = '#FFFFFF';
          c.font = 'bold 12px monospace';
          c.fillText(`💥 POWER: ${curSkill.minDamage} - ${curSkill.maxDamage} DMG  •  ${curSkill.description}`, 40, panelY + 64);

          c.fillStyle = '#888888';
          c.font = '11px monospace';
          c.fillText('Navigasi: [WASD] / [Panah] • [ENTER] / Klik merapal • [ESC] / [Q] Batal', 40, panelY + 90);
        }

        // Right/Full Area: 2x2 Grid of Mage Spell Cards
        const gridW = isNarrow ? W - 20 : Math.min(460, W * 0.52);
        const gridH = panelH - 20;
        const gridX = isNarrow ? 10 : W - gridW - 20;
        const cardW = (gridW - 12) / 2;
        const cardH = (gridH - 10) / 2;

        MAGE_SKILLS.forEach((skill, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const cardX = gridX + col * (cardW + 12);
          const cardY = panelY + 10 + row * (cardH + 8);
          const isSelected = selectedSkillIndex === idx;

          drawSkillCard(c, cardX, cardY, cardW, cardH, skill, isSelected);
        });
        return;
      }
    };

    /* ── DRAW STYLIZED MAGE SKILL CARD ── */
    const drawSkillCard = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      skill: MageSkill,
      isSelected: boolean
    ) => {
      c.save();
      c.translate(x, y);

      const skew = -8;

      // Hard Shadow
      c.fillStyle = '#000000';
      c.beginPath();
      c.moveTo(skew + 3, 3);
      c.lineTo(w + skew + 3, 3);
      c.lineTo(w + 3, h + 3);
      c.lineTo(3, h + 3);
      c.closePath();
      c.fill();

      // Main Shape
      c.fillStyle = isSelected ? '#FFFFFF' : '#141419';
      c.beginPath();
      c.moveTo(skew, 0);
      c.lineTo(w + skew, 0);
      c.lineTo(w, h);
      c.lineTo(0, h);
      c.closePath();
      c.fill();

      // Accent Edge bar
      c.fillStyle = skill.color;
      c.beginPath();
      c.moveTo(skew, 0);
      c.lineTo(skew + 6, 0);
      c.lineTo(6, h);
      c.lineTo(0, h);
      c.closePath();
      c.fill();

      // Border when selected
      if (isSelected) {
        c.strokeStyle = skill.color;
        c.lineWidth = 3;
        c.stroke();
      } else {
        c.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        c.lineWidth = 1;
        c.stroke();
      }

      // Title Text
      c.fillStyle = isSelected ? '#000000' : '#FFFFFF';
      c.font = '900 13px sans-serif';
      c.fillText(skill.name, isSelected ? 18 : 14, h * 0.48);

      // Subtitle Badge & Power
      c.fillStyle = skill.color;
      c.font = 'bold 10px monospace';
      c.fillText(`${skill.badge} (${skill.minDamage}-${skill.maxDamage})`, isSelected ? 18 : 14, h * 0.82);

      // Arrow indicator
      if (isSelected) {
        c.fillStyle = skill.color;
        c.font = 'bold 12px monospace';
        c.fillText('▶', 6, h * 0.54);
      }

      c.restore();
    };

    /* ── DRAW STYLIZED ACTION BUTTON ── */
    const drawActionButton = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      title: string,
      subtitle: string,
      isSelected: boolean,
      color: string
    ) => {
      c.save();
      c.translate(x, y);

      const skew = -10;

      // Hard Shadow
      c.fillStyle = '#000000';
      c.beginPath();
      c.moveTo(skew + 4, 4);
      c.lineTo(w + skew + 4, 4);
      c.lineTo(w + 4, h + 4);
      c.lineTo(4, h + 4);
      c.closePath();
      c.fill();

      // Main Shape
      c.fillStyle = isSelected ? '#FFFFFF' : color;
      c.beginPath();
      c.moveTo(skew, 0);
      c.lineTo(w + skew, 0);
      c.lineTo(w, h);
      c.lineTo(0, h);
      c.closePath();
      c.fill();

      // Border when selected
      if (isSelected) {
        c.strokeStyle = '#D6001C';
        c.lineWidth = 4;
        c.stroke();
      }

      // Title Text
      c.fillStyle = isSelected ? '#D6001C' : '#FFFFFF';
      c.font = '900 22px sans-serif';
      c.fillText(title, 24, h * 0.48);

      // Subtitle
      c.fillStyle = isSelected ? '#000000' : '#CCCCCC';
      c.font = 'bold 10px monospace';
      c.fillText(subtitle, 24, h * 0.78);

      // Indicator Arrow if selected
      if (isSelected) {
        c.fillStyle = '#D6001C';
        c.font = 'bold 20px monospace';
        c.fillText('▶', 6, h * 0.52);
      }

      c.restore();
    };

    const getCanvasPos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / (rect.width || 1);
      const scaleY = canvas.height / (rect.height || 1);
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (gameState !== 'OVERWORLD') return;
      const pos = getCanvasPos(e.clientX, e.clientY);
      // Skip top bar area (Exit button, HUD tools)
      if (pos.y < 65) return;

      // Accept touch or mouse left click
      if (e.pointerType === 'touch' || e.pointerType === 'pen' || e.button === 0) {
        isPointerDownRef.current = true;
        joystickRef.current = {
          active: true,
          touchId: e.pointerId,
          baseX: pos.x,
          baseY: pos.y,
          currX: pos.x,
          currY: pos.y,
          vectorX: 0,
          vectorY: 0,
        };
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current || !joystickRef.current.active) return;
      if (e.pointerId !== joystickRef.current.touchId) return;

      const pos = getCanvasPos(e.clientX, e.clientY);
      const dx = pos.x - joystickRef.current.baseX;
      const dy = pos.y - joystickRef.current.baseY;
      const dist = Math.hypot(dx, dy);
      const MAX_RADIUS = 55;
      const DEADZONE = 6;

      if (dist > DEADZONE) {
        const clampedDist = Math.min(dist, MAX_RADIUS);
        const norm = clampedDist / MAX_RADIUS;
        joystickRef.current.vectorX = (dx / dist) * norm;
        joystickRef.current.vectorY = (dy / dist) * norm;
        joystickRef.current.currX = joystickRef.current.baseX + (dx / dist) * clampedDist;
        joystickRef.current.currY = joystickRef.current.baseY + (dy / dist) * clampedDist;
      } else {
        joystickRef.current.vectorX = 0;
        joystickRef.current.vectorY = 0;
        joystickRef.current.currX = pos.x;
        joystickRef.current.currY = pos.y;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerId === joystickRef.current.touchId) {
        isPointerDownRef.current = false;
        joystickRef.current.active = false;
        joystickRef.current.touchId = null;
        joystickRef.current.vectorX = 0;
        joystickRef.current.vectorY = 0;
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      cancelAnimationFrame(animId);
    };
  }, [gameState, battlePhase, battleMessage, currentEnemy, playerHp, maxPlayerHp, selectedActionIndex, selectedSkillIndex]);

  /* ── MOUSE CLICK / TAP HANDLER ON CANVAS ── */
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'BATTLE') return;

    if (battlePhase === 'INTRO') {
      sounds.playSelect();
      setBattlePhase('PLAYER_MENU');
      setBattleMessage('PILIH AKSI KAMU:');
      return;
    }

    if (battlePhase === 'SKILL_MENU') {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const isNarrow = W < 680;
      const panelH = isNarrow ? Math.min(150, Math.max(120, H * 0.25)) : Math.min(130, H * 0.20);
      const panelY = H - panelH;
      const gridW = isNarrow ? W - 20 : Math.min(460, W * 0.52);
      const gridH = panelH - 20;
      const gridX = isNarrow ? 10 : W - gridW - 20;
      const cardW = (gridW - 12) / 2;
      const cardH = (gridH - 10) / 2;

      const mx = e.clientX;
      const my = e.clientY;

      for (let idx = 0; idx < MAGE_SKILLS.length; idx++) {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cardX = gridX + col * (cardW + 12);
        const cardY = panelY + 10 + row * (cardH + 8);

        if (mx >= cardX && mx <= cardX + cardW && my >= cardY && my <= cardY + cardH) {
          sounds.playSelect();
          setSelectedSkillIndex(idx);
          executeSkill(MAGE_SKILLS[idx]);
          return;
        }
      }

      // Klik area kiri panel untuk kembali ke PLAYER_MENU
      if (mx < gridX && my >= panelY) {
        sounds.playSelect();
        setBattlePhase('PLAYER_MENU');
        setBattleMessage('PILIH AKSI KAMU:');
      }
      return;
    }

    if (battlePhase === 'PLAYER_MENU') {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const isNarrow = W < 680;
      const panelH = isNarrow ? Math.min(150, Math.max(120, H * 0.25)) : Math.min(130, H * 0.20);
      const panelY = H - panelH;

      const btnW = isNarrow ? Math.max(130, (W - 36) / 2) : Math.min(220, W * 0.22);
      const btnH = isNarrow ? panelH - 42 : panelH - 30;
      const btnY = isNarrow ? panelY + 36 : panelY + 15;

      const btn1X = isNarrow ? 14 : W - btnW * 2 - 40;
      const btn2X = isNarrow ? 14 + btnW + 8 : W - btnW - 20;

      const mx = e.clientX;
      const my = e.clientY;

      if (mx >= btn1X && mx <= btn1X + btnW && my >= btnY && my <= btnY + btnH) {
        sounds.playSelect();
        setSelectedActionIndex(0);
        setBattlePhase('SKILL_MENU');
        setBattleMessage('PILIH SPELL SIHIR MAGE:');
        setSelectedSkillIndex(0);
      } else if (mx >= btn2X && mx <= btn2X + btnW && my >= btnY && my <= btnY + btnH) {
        setSelectedActionIndex(1);
        executeRun();
      }
    }
  };

  /* ── RESET GAME ── */
  const resetGame = () => {
    playerRef.current.x = 290;
    playerRef.current.y = 130;
    setPlayerHp(100);
    setGameState('OVERWORLD');
    setBattlePhase('INTRO');
    sounds.playSelect();
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden select-none">
      {/* FULLSCREEN CANVAS */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="block w-full h-full cursor-pointer touch-none"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* TOP FLOATING MINIMAL HUD BAR */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-50">
        {/* Back Link */}
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-black/80 hover:bg-[#D6001C] text-white text-xs font-bold uppercase tracking-wider border border-white/20 hover:border-white transition-all shadow-lg active:scale-95 sharp-corner"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit ke Web</span>
        </Link>

        {/* Center Hint for WASD Movement (Desktop) */}
        {gameState === 'OVERWORLD' && (
          <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-black/75 border border-white/20 text-neutral-300 text-xs font-mono backdrop-blur-sm">
            <span>
              Jalan: <strong className="text-white">WASD</strong> / <strong className="text-white">Panah</strong>
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-[#FF2A4D]">
              Zona Musuh: <strong>Bercak Merah</strong>
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400">
              Tekan <strong className="text-white">[H]</strong> Hitbox
            </span>
          </div>
        )}

        {/* Mobile Floating Touch Hint */}
        {gameState === 'OVERWORLD' && (
          <div className="flex sm:hidden items-center gap-2 px-3 py-1 bg-black/80 border border-white/20 text-neutral-300 text-[11px] font-mono backdrop-blur-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D6001C] animate-pulse" />
            <span>Sentuh & geser layar untuk jalan</span>
          </div>
        )}

        {/* Right Action Tools */}
        <div className="pointer-events-auto flex items-center gap-2">
          {gameState === 'OVERWORLD' && (
            <button
              onClick={() => setShowHitboxes((prev) => !prev)}
              className={`px-3 py-2 text-xs font-mono border transition-all ${
                showHitboxes
                  ? 'bg-[#D6001C] text-white border-white shadow-lg'
                  : 'bg-black/80 text-neutral-400 border-white/20 hover:text-white'
              }`}
              title="Toggle Garis Pembatas (Hitbox)"
            >
              {showHitboxes ? 'HITBOX: ON' : 'HITBOX: OFF'}
            </button>
          )}

          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-2 bg-black/80 border border-white/20 text-xs font-mono text-white hover:border-[#D6001C] transition-colors"
            title={isMuted ? 'Nyalakan Audio' : 'Matikan Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-green-400" />}
            <span>{isMuted ? 'MUTE' : 'SFX ON'}</span>
          </button>
          <button
            onClick={resetGame}
            className="p-2 bg-black/80 border border-white/20 text-white hover:border-[#D6001C] transition-colors"
            title="Reset Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
