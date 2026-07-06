# 🌍 Memory Sphere 3D

![GitHub stars](https://img.shields.io/github/stars/harshskarki/Memory-Sphere-3D?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/harshskarki/Memory-Sphere-3D?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/harshskarki/Memory-Sphere-3D?style=for-the-badge)
![License](https://img.shields.io/github/license/harshskarki/Memory-Sphere-3D?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![WebGL](https://img.shields.io/badge/WebGL-Shaders-990000?style=for-the-badge&logo=webgl&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![IndexedDB](https://img.shields.io/badge/IndexedDB-Storage-blue?style=for-the-badge)
![Visitors](https://komarev.com/ghpvc/?username=harshskarki&repo=Memory-Sphere-3D&style=for-the-badge)

📸 A fully interactive, physics-driven 3D photo gallery built with Three.js, custom WebGL shaders, and synthesized spatial audio.

---

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://memory-sphere-3d.vercel.app/)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

## 🚀 Live Demo

👉 https://memory-sphere-3d.vercel.app/

---

## 📌 Overview

**Memory Sphere 3D** is a purely client-side web application that transforms standard photo uploads into a tactile, floating 3D globe of memories.

This project demonstrates advanced frontend engineering and creative coding skills by integrating:

- 🧊 **Three.js & 3D Math:** Fibonacci sphere distribution & raycasting
- 🪄 **Custom WebGL Shaders:** Fragment and vertex shaders for organic paper physics
- 🔊 **Web Audio API:** Synthesized procedural sound effects (Tone.js)
- 💾 **Browser Databases:** Raw file persistence via IndexedDB

---

## ✨ Key Features

### 🧊 3D Engine & Physics

- Perfect mathematical distribution using the Fibonacci sphere algorithm
- Physics-based inertia dragging and auto-rotation (OrbitControls)
- Smooth cinematic camera transitions and click-to-zoom mechanics via TWEEN.js

### 🪄 Custom WebGL Shaders

- **Torn Paper Effect:** Custom fragment shader mathematically tears mesh edges using pseudo-random noise
- **Wind Flutter:** Custom vertex shader applies sine-wave distortion on hover to simulate physical paper

### 🔊 Procedural Spatial Audio

- **Zero MP3s:** All sounds generated mathematically using Tone.js
- **Tactile Interactions:** Paper swish, mechanical click, and dynamic ambient hum linked to globe rotation

### 💾 Local Persistence (IndexedDB)

- Photos stored securely in browser storage
- User images automatically restored after refresh without a backend

### 🔍 Smart Search Engine

- Live search by tag, location, and index
- Non-matching photos fade into a ghost state without breaking immersion

---

## ⚙️ How It Works

1. User uploads image files
2. Canvas API crops and adds sketch-style borders
3. Raw files are saved in IndexedDB
4. Fibonacci sphere math calculates optimal image placement
5. Raycasting triggers shaders, audio, and camera animations

---

## 🏗️ Architecture

```text
User Image Upload
  │
  ▼
Canvas API (Draws Sketched Borders) ──► IndexedDB (Saves Locally)
  │
  ▼
Three.js Engine (Fibonacci Math)
  │
  ├──► WebGL Shaders (Tears Edges & Adds Wind Flutter)
  ├──► TWEEN.js (Handles Cinematic Camera Zooms)
  └──► Tone.js (Synthesizes Audio)
  │
  ▼
Interactive 3D Render
```

---

## 📖 Project Case Study

### Background

Traditional grid-based photo galleries are static and lack emotional resonance. This project explores a more immersive and tactile approach to memory visualization.

### Objective

Build a highly performant, visually engaging 3D photo experience entirely on the frontend while maintaining persistence and smooth frame rates.

### Solution

Three.js powers the rendering engine, custom GLSL shaders create physical-looking interactions, Tone.js synthesizes procedural audio, and IndexedDB stores images locally.

### Result

A serverless 3D gallery experience that feels dynamic, immersive, and responsive while securely storing data in the browser.

---

## 🎯 Recruiter Highlights

This project demonstrates the ability to go beyond standard CRUD applications and work with advanced browser APIs, rendering engines, shaders, and audio systems.

### Skills Demonstrated

- Creative Coding with Three.js
- 3D Mathematics & Coordinate Mapping
- GLSL Shader Development
- Web Audio API Integration
- IndexedDB Data Management
- Modular ES6 Architecture

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|------------|
| Rendering | Three.js, WebGL (GLSL) |
| Animation | TWEEN.js |
| Audio | Tone.js |
| Storage | IndexedDB, idb-keyval |
| Styling | Tailwind CSS, Custom CSS |
| Logic | Vanilla JavaScript (ES6 Modules) |

---

## 📂 Project Structure

```text
Memory-Sphere-3D/
│
├── index.html
├── css/
│   └── style.css
├── assets/
│   └── .gitkeep
└── js/
    ├── main.js
    ├── engine.js
    ├── globe.js
    ├── interaction.js
    ├── graphics.js
    ├── shaders.js
    ├── audio.js
    ├── storage.js
    └── state.js
```

---

## 🚀 Local Setup

Because this project uses ES6 Modules, it must be served through a local development server.

### Clone Repository

```bash
git clone https://github.com/harshskarki/Memory-Sphere-3D.git
cd Memory-Sphere-3D
```

### Run Locally

```bash
# Open project in VS Code

# Install Live Server Extension

# Right Click index.html
# Select "Open with Live Server"
```

---

## 📸 Screenshots

```text
Add project screenshots here
```

---

## 🚀 Future Improvements

- 🎥 Cinematic Tour Mode using GSAP
- 🤝 WebRTC-powered Globe Sharing
- 🥽 WebXR / VR Support for Meta Quest

---

## 🏆 Project Highlights

- ✔ Engineered custom GLSL shaders for geometry distortion
- ✔ Built a modular ES6 architecture
- ✔ Generated procedural audio directly in the browser
- ✔ Created a serverless persistence model using IndexedDB

---

## 👨‍💻 Author

### Harshvardhan Singh Karki

🌐 Portfolio  
https://harshvardhansportfolio.vercel.app/

💼 LinkedIn  
https://linkedin.com/in/harshvardhan-singh-karki-a9316038a/

💻 GitHub  
https://github.com/harshskarki

---

## ⭐ Support

If you found this project useful, please consider giving it a star on GitHub.

```bash
⭐ Star the repository
🍴 Fork the project
📢 Share it with others
```
