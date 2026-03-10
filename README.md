# 🕹️ Pac-Man Lab (3D & 2D Experience)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-%2344A833.svg?style=for-the-badge&logo=vitest&logoColor=white)

**Pac-Man Lab** is a highly modified, modern reimagining of the classic Pac-Man game. Built from the ground up using React, Three.js, and React Three Fiber, it seamlessly blends nostalgic gameplay with modern web capabilities. 

The application offers multiple viewing perspectives (2D, 3D Spectator, and 3D FPS), custom avatar support, and is fully optimized for cross-device compatibility. As a **Progressive Web App (PWA)**, it can be installed natively on mobile devices for a seamless gaming experience.

---

## ✨ Key Features

* **🎮 Multi-Dimensional Gameplay:** Switch seamlessly between Classic 2D, 3D Spectator, and an immersive First-Person (FPS) 3D mode.
* **🧑‍🚀 Custom Avatars:** Play with the classic Pac-Man character or choose a custom user avatar.
* **📱 PWA Ready:** Fully installable as a standalone app on iOS and Android devices with offline caching.
* **⚙️ Modern Settings Engine:** Comprehensive settings panel for audio, visual tweaks, and controls.
* **🌍 Localization (i18n):** Multi-language support (English & Georgian) using `i18next`.
* **🔊 Immersive Audio:** Dynamic sound effects engineered with `use-sound`.
* **🕹️ Cross-Device Controls:** Keyboard controls for Desktop and optimized Touch/Mobile controls for mobile devices.

---

## 🛠️ Tech Stack

### Core Technologies
* **Frontend Framework:** React 19, React Router DOM
* **Language:** TypeScript
* **3D Graphics & Rendering:** Three.js, `@react-three/fiber`, `@react-three/drei`
* **Styling:** Tailwind CSS (v4), `clsx`, `tailwind-merge`
* **Icons:** Lucide React

### State Management & Architecture
* **Context API:** Global state managed via modular contexts (`GameContext`, `ThemeContext`).
* **Custom Hooks:** Encapsulated logic (`useGameAudio`, `usePlayerHeading`, `useIsMobile`).

### Tooling & Testing
* **Build Tool:** Vite
* **PWA Plugin:** `vite-plugin-pwa`
* **Testing:** Vitest, React Testing Library, Jest DOM
* **Code Quality:** ESLint

---

## 📂 Project Architecture

The codebase is organized with scalability and separation of concerns in mind:🚀 Getting Started
Follow these steps to set up the project locally. Note: No environment variables are required to run this application.

```text
src/
├── assets/             # Static SVGs and visual assets
├── components/
│   ├── Game/           # Core gameplay components (2D, 3D, Player, InstancedLevel)
│   ├── layout/         # App shell components (Header, MobileControls, ShowcaseLayout)
│   └── UI/             # Interface overlays, Settings, Modals, Loaders
├── context/            # Global state providers (GameProvider, ThemeProvider)
├── hooks/              # Reusable custom React hooks
├── locales/            # i18n translation files (en, ka)
├── pages/              # Route-level components (GamePage, SettingsPage, Showcases)
├── tests/              # Vitest unit and integration tests
├── types/              # Global TypeScript interfaces and types
└── utils/              # Pure functions for game logic (physics, ghost logic, formatting)
```


🚀 Getting Started

Follow these steps to set up the project locally. Note: No environment variables are required to run this application.

Prerequisites

1. Node.js (v18 or higher recommended)
2. npm or yarn

Installation
1. Clone the repository:

    git clone  https://github.com/yourusername/pacman-lab.git

2. Install dependencies:
    npm install

3. Start the development server:
    npm run dev
   
The application will be available at http://localhost:5173.

🧪 Testing
The project uses Vitest for unit and component testing, ensuring stable game physics and UI rendering. Test files are located in the src/tests directory.

To run the test suite:   npm run test

🏗️ Build & Deployment

npm run build
