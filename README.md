# 🧠 MindSprint — Game-Based Cognitive Assessment Platform

<p align="center">
  <img src="public/favicon.svg" alt="MindSprint Logo" width="72" height="72" />
</p>

<p align="center">
  <strong>Train your thinking. Sharpen your edge.</strong><br>
  An interactive, production-grade cognitive assessment practice platform designed to prepare candidates for modern graduate and corporate game-based hiring assessments (such as Accenture, HireVue, and contemporary gamified screening platforms).
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-blue.svg" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF.svg" alt="Vite" />
  <img src="https://img.shields.io/badge/Levels-75%20Procedural-success.svg" alt="75 Levels" />
  <img src="https://img.shields.io/badge/Assessment-3%20Cognitive%20Games-indigo.svg" alt="3 Games" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License MIT" />
</p>

---

## 🚀 Overview

Modern graduate and tech hiring processes have evolved from static multiple-choice questionnaires to **interactive, gamified cognitive assessments**. Traditional test prep platforms fail to replicate these dynamic environments.

**MindSprint** bridges this gap by providing **75 procedural, fully interactive cognitive levels** across three distinct game engines:
1. **🫧 Select Bubbles** — Rapid mental arithmetic & ascending-order selection.
2. **🔑 Invisible Maze** — Memory-based invisible-wall spatial navigation.
3. **🧭 Pathfinder** — Spatial tile rearrangement & track continuous connection.

---

## 🎮 The Three Cognitive Assessment Games

```text
                                 ┌───────────────────────┐
                                 │   MindSprint Engine   │
                                 └───────────┬───────────┘
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
   ┌───────────────────────┐     ┌───────────────────────┐     ┌───────────────────────┐
   │    Select Bubbles     │     │    Invisible Maze     │     │      Pathfinder       │
   │  25 Levels · 15s/lvl  │     │   25 Levels · 3m/lvl  │     │   25 Levels · 4m/lvl  │
   │  Mental Calculation   │     │  Memory & Navigation  │     │  Spatial Arrangement  │
   └───────────────────────┘     └───────────────────────┘     └───────────────────────┘
```

### 1. 🫧 Select Bubbles (Ascending Order)
* **Format**: 25 Levels · **15 Seconds per level**
* **Core Mechanic**: Three floating expression bubbles (e.g. `18 ÷ 3`, `7 + 5`, `4 × 4`) are presented. The candidate solves them mentally and clicks the bubbles in **strictly ascending numerical order** (`Smallest → Middle → Largest`).
* **Visual Interaction**: Selecting a bubble awards an order badge (`1`, `2`, `3`). Selecting the 3rd bubble **automatically evaluates and transitions** instantly without needing a submit button.
* **Difficulty Curve**:
  * *Levels 1–5 (Easy)*: Basic addition, subtraction, and single-digit multiplication.
  * *Levels 6–12 (Medium)*: Division, decimals, and two-step operations.
  * *Levels 13–19 (Hard)*: Parentheses, percentages, multi-operations.
  * *Levels 20–25 (Very Hard)*: Tight numerical spacing (e.g., results within 0.5–1 unit apart) testing mental calculation accuracy.
* **Controls**: Mouse click / Mobile tap or keyboard number keys `1`, `2`, `3` / `A`, `B`, `C`.

---

### 2. 🔑 Invisible Maze (Memory-Based Hidden Wall Navigation)
* **Format**: 25 Levels · **3 Minutes per level** (4×4 to 7×7 grids)
* **Core Mechanic**: The player must navigate from Start (`S`), find and collect the Key (`🔑`), and reach the Exit Door (`🚪`).
* **Critical Memory Rule**:
  * **All hidden walls are 100% invisible** before and after collision.
  * Attempting to move into a hidden wall triggers a collision and **resets the player all the way back to the Start position**.
  * The candidate must build and retain an internal mental map of blocked pathways to successfully reach the Key and Door.
* **Solvability Guarantee**: Every generated maze is pre-validated via BFS pathfinding algorithms to ensure both `Start → Key` and `Key → Door` routes exist and can be completed.
* **Controls**: Arrow Keys (`↑`, `↓`, `←`, `→`), `W`/`A`/`S`/`D`, or on-screen touch D-Pad.

---

### 3. 🧭 Pathfinder (Path Tile Rearrangement)
* **Format**: 25 Levels · **4 Minutes per level** (3×3 to 6×6 grids)
* **Core Mechanic**: Scrambled pipe/track tiles must be rearranged to construct **one continuous unbroken route** connecting Start (`S`) to End (`E`).
* **Fixed Orientation**: Tile positions can be swapped (`Click Tile A → Click Tile B`), but **tile orientation is fixed** (no rotation), testing pure spatial configuration.
* **Instant Verification**: After every swap, graph connectivity tracing checks whether a valid continuous link connects `S` to `E`, triggering completion upon route alignment.
* **Controls**: Click-to-select and click-to-swap on Desktop and Touch/Mobile.

---

## ✨ Key Platform Features

- 🎯 **Independent Game Selection Hub**: Choose and practice any game independently in any order. Live level progress badges indicate completed counts (e.g. `Complete (25/25)` or `12/25 Levels`).
- ⏱️ **Independent Per-Level Timers**: Each level operates with its own fresh countdown timer with zero carry-over. Visual states dynamically adjust:
  - *Normal* (>25% time remaining)
  - *Warning* (≤25% time remaining)
  - *Critical* (≤10% time remaining with subtle pulse animation)
- 🛑 **Safe "End Game" Architecture**: A prominent **End Game** button in the header opens a confirmation modal showing current progress, allowing candidates to safely exit and return to the game hub without losing completed level data.
- 📊 **Practice Performance Indicators**: Detailed objective competency scores (0–100 scale):
  - **Numerical Processing** (calculation speed & accuracy)
  - **Spatial Navigation** (route memory & collision avoidance)
  - **Spatial Arrangement** (tile pattern recognition)
  - **Planning Efficiency** (move and swap optimization against theoretical par)
- 🔍 **Filterable Level-by-Level Review**: Full breakdown of all 75 levels across the assessment with completion status, time spent, moves taken, and solutions.
- 💾 **Local-First & Zero Friction**: All assessments, attempts, and sessions are persisted locally in `sessionStorage` and `localStorage` with no account registration required.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18 (Hooks, Context API, Reducer pattern) |
| **Build & Tooling** | Vite, Rollup, Node.js |
| **Styling** | Vanilla CSS Modules (CSS Custom Properties Design System) |
| **Typography & Icons** | Google Inter, Lucide React Icons |
| **Algorithms** | Procedural math generation, BFS graph pathfinding & continuous route tracing |

---

## 📁 Project Structure

```text
Accenture-game-based/
├── public/                     # Static assets & favicons
├── src/
│   ├── components/
│   │   ├── assessment/         # Assessment header & LevelTimer components
│   │   ├── common/             # Reusable UI (Button, Modal, ProgressBar, Badge)
│   │   └── games/
│   │       ├── SelectBubbles/  # SelectBubblesGame, Bubble component & styles
│   │       ├── InvisibleMaze/  # InvisibleMazeGame, MazeGrid, DPad & styles
│   │       └── Pathfinder/     # PathfinderGame, PathfinderGrid, PathTile & styles
│   ├── config/
│   │   └── gameConfig.js       # Centralized timing, level counts & game parameters
│   ├── context/
│   │   └── AssessmentContext.jsx # Central assessment state, timers, records & history
│   ├── data/
│   │   ├── bubbleGenerator.js  # 25 procedural math expression levels generator
│   │   ├── mazeGenerator.js    # 25 BFS-validated hidden-wall maze levels generator
│   │   ├── pathfinderGenerator.js # 25 continuous track path levels generator
│   │   └── questionGenerators.js # Full assessment coordinator
│   ├── pages/
│   │   ├── Landing.jsx         # Landing page with interactive live previews
│   │   ├── Dashboard.jsx       # Student dashboard & past attempt analytics
│   │   ├── Instructions.jsx    # Game rules & guidelines overview
│   │   ├── Assessment.jsx      # Game selection hub, active game stage & summary
│   │   ├── Results.jsx         # Assessment score cards & skill indicators
│   │   └── Review.jsx          # Filterable 75-level review breakdown
│   ├── styles/
│   │   ├── globals.css         # Global resets and layout utilities
│   │   └── variables.css       # Color tokens, spacing, typography & shadows
│   ├── utils/
│   │   ├── scoring.js          # Scoring engine, skill calculation & analytics
│   │   └── formatting.js       # Duration, date, and game type helpers
│   ├── App.jsx                 # Client-side routing & route guards
│   └── main.jsx                # Application root entrypoint
├── test_generators.js          # Generator test script (3,000 level verification)
├── index.html                  # HTML template
└── package.json                # Project dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18.0.0 or higher recommended)
- npm or yarn

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/rishabhpandey30/MindSprint.git
   cd MindSprint
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Verify procedural generators (optional)**:
   ```bash
   node test_generators.js
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 👨‍💻 Developed By

<p>
  <strong>Rishabh Pandey</strong><br>
  Frontend Engineer & Full-Stack Developer
</p>

- 📧 **Email**: [rishabhpandey3011@gmail.com](mailto:rishabhpandey3011@gmail.com)
- 💼 **LinkedIn**: [linkedin.com/in/rishabh-pandey-78r0](https://www.linkedin.com/in/rishabh-pandey-78r0/)
- 🐙 **GitHub**: [@rishabhpandey30](https://github.com/rishabhpandey30)

---

## 📜 Disclaimer

MindSprint is an independent educational practice platform designed to help students and candidates sharpen their cognitive speed and spatial reasoning. It is not affiliated with, endorsed by, or associated with any corporate assessment provider or recruitment entity.

---

<p align="center">
  Made with ❤️ by <a href="https://www.linkedin.com/in/rishabh-pandey-78r0/">Rishabh Pandey</a>
</p>
