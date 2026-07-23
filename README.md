# 🎭 Persona 5 Themed Developer Portfolio

A highly interactive, visually striking developer portfolio built with **Next.js**, **React**, **Tailwind CSS**, and **GSAP**. Heavily inspired by the iconic, dynamic, and aggressive UI/UX of *Persona 5*.


## ✨ Features

- **Rebellious UI/UX**: Hard shadows, skewed elements, and striking red/black/white color palettes.
- **Silky Smooth Animations**: Powered by `GSAP` and `Framer Motion` for cinematic page transitions and dynamic staggered element reveals.
- **Smart Landscape Scaler**: A custom viewport scaling system that locks the layout perfectly at a 16:9 cinematic ratio (1280x720) across all devices, including ultra-wides and Android phones in landscape orientation.
- **Immersive Audio**: Integrated interactive sound effects and background music using `Howler.js` to bring the Persona 5 aesthetic to life.
- **Data-Driven Architecture**: Projects and certificates are decoupled from the UI and easily manageable via static JSON data files.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [GSAP](https://gsap.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Audio**: [Howler.js](https://howlerjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Customization

This portfolio is designed to be easily updated! You don't need to dive deep into the React code to add your own experience:

- **Projects**: Edit `/data/projects.json` to add or modify your showcased work.
- **Certificates**: Edit `/data/certificates.json` to update your achievements and certifications.
- **Assets**: Swap out images in the `/public/img/WEBP` and `/public/img/SVG` directories.

## 🎨 Design Philosophy

This project aims to break away from the traditional, minimalist "corporate" web design. It embraces the bold, chaotic, yet highly organized aesthetic of Japanese role-playing games, proving that the web can be both highly functional and artistically rebellious.
