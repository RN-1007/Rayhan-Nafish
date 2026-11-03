# 🎨 Panduan & Spesifikasi Aset Mini Game 2D
> **Tema:** *Persona 5 / Phantom Thieves / Stylish Developer JRPG*  
> **Palet Warna:** Crimson Red (`#D6001C`), Pitch Black (`#000000`), Crisp White (`#FFFFFF`), Dark Gray (`#1B1B1B`).

Dokumen ini berisi daftar spesifikasi dimensi, format file, dan struktur folder untuk aset game.

---

## 📁 Struktur Folder Penyimpanan (`/public/game/`)

Simpan file aset Anda di folder ini:
```text
portofolio/
└── public/
    └── game/
        ├── player/
        │   ├── player-walk.png           # Spritesheet jalan 4 arah (32x32 per frame)
        │   └── player-battle-back.png    # Sprite tampak belakang saat bertarung (96x96 / 128x128)
        ├── enemies/
        │   ├── enemy-bug.png             # Monster Bug #404 (96x96 PNG transparan)
        │   ├── enemy-deadline.png        # Monster Deadline (110x110 PNG transparan)
        │   └── enemy-glitch.png          # Monster CSS Overflow (96x96 PNG transparan)
        ├── battle/
        │   ├── battle-bg.webp            # Background arena (576x416 WebP)
        │   └── battle-pedestal.png       # Pijakan lingkaran karakter/musuh (160x60 PNG transparan)
        └── tiles/
            ├── ground-tiles.png          # Tile aspal/lantai (32x32 PNG)
            ├── encounter-zone.png        # Area picu musuh / kabel/kabut merah (32x32 PNG)
            └── props-obstacle.png        # Rintangan tiang/vending machine (32x32 atau 32x64 PNG)
```

---

## 1. 🚶 Karakter Pemain (Player)

| Nama File | Deskripsi Visual | Resolusi | Format | Transparansi |
| :--- | :--- | :--- | :--- | :--- |
| **`player/player-walk.png`** | Spritesheet jalan 4 arah (Bawah, Atas, Kiri, Kanan). Setiap arah memiliki 2–3 frame animasi langkah. | **32 × 32 px** per frame *(Grid 96 × 128 px)* | **PNG** | ✅ Ya (Transparan) |
| **`player/player-battle-back.png`** | Tampak belakang karakter saat bertarung (siluet jubah Persona 5 memegang belati/laptop). | **96 × 96 px** s/d **128 × 128 px** | **PNG** | ✅ Ya (Transparan) |

---

## 2. 👾 Musuh (Enemy Sprites)

| Nama File | Konsep Musuh | Resolusi | Format | Transparansi |
| :--- | :--- | :--- | :--- | :--- |
| **`enemies/enemy-bug.png`** | **WILD BUG #404:** Bayangan bertopeng retak dengan aura merah (*Runtime Error*). | **96 × 96 px** | **PNG** | ✅ Ya (Transparan) |
| **`enemies/enemy-deadline.png`** | **DEADLINE MENDADAK:** Jam weker raksasa bertanduk dengan mata merah menyala (*Sprint Crisis*). | **110 × 110 px** | **PNG** | ✅ Ya (Transparan) |
| **`enemies/enemy-glitch.png`** | **CSS OVERFLOW:** Glitch kubus digital dengan kode bertumpukan (*Layout Shift*). | **96 × 96 px** | **PNG** | ✅ Ya (Transparan) |

---

## 3. 🗺️ Map & Tileset (Overworld)

Semua tile menggunakan basis kelipatan **32 × 32 px**:

| Tipe Objek | Deskripsi | Resolusi | Format | Transparansi |
| :--- | :--- | :--- | :--- | :--- |
| **Lantai Jalan (Path)** | Aspal jalanan kota metropolitan / paving cyberpunk gelap. | **32 × 32 px** | **PNG** | ❌ Solid |
| **Encounter Zone** | Pengganti rumput liar (misal: kabel server bercahaya merah / kabut Metaverse). | **32 × 32 px** | **PNG** | ✅ Ya (Transparan) |
| **Rintangan (Obstacle)** | Tiang lampu jalan, mesin penjual otomatis (*vending machine*), atau dinding pembatas. | **32 × 32 px** / **32 × 64 px** | **PNG** | ✅ Ya (Transparan) |
| **Dev Landmark** | Meja kerja terminal monitor menyala (tempat istirahat). | **64 × 64 px** | **PNG** | ✅ Ya (Transparan) |

---

## 4. ⚔️ Arena Pertarungan (Battle Screen)

| Nama File | Deskripsi | Resolusi | Format | Transparansi |
| :--- | :--- | :--- | :--- | :--- |
| **`battle/battle-bg.webp`** | Background arena: Stasiun subway / siluet kota malam dengan langit merah bertitik komik (*halftone*). | **576 × 416 px** | **WebP** | ❌ Solid |
| **`battle/battle-pedestal.png`** | Pijakan lingkaran tempat berdiri karakter & musuh di arena. | **160 × 60 px** | **PNG** | ✅ Ya (Transparan) |

---

## 🛠️ Tool Gratis yang Direkomendasikan:
1. **Editor Pixel Art:** [Piskel](https://www.piskelapp.com/) (Web) atau [Aseprite](https://www.aseprite.org/).
2. **Kompresi ke WebP:** [Squoosh.app](https://squoosh.app/) (Google).
3. **Efek Suara 8-Bit:** [Chiptone](https://sfbgames.itch.io/chiptone).
