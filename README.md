# FREEDOM

FREEDOM — ระบบจัดการภาพยนตร์และสตรีมมิ่ง (Movie management & streaming admin panel)

Short description
- A TypeScript + React (Vite) admin dashboard for managing movies, banners, live streams, users and site settings. Includes local data seed, localStorage persistence, an admin "cinema" player and live-stream studio UI.

Features
- Movies CRUD with poster/trailer/stream playback
- Live stream management and in-app player
- Banner/media library management
- Dual concurrent user sessions (admin + staff) with fast switching
- Command palette, keyboard shortcuts and quick preview of the public site
- Local data persistence using localStorage (seeded from initialData)
- Vite dev server for fast development

Tech stack
- TypeScript, React, Vite
- Tailwind CSS (devDependency)
- hls.js for HLS playback
- Express (dependency) — included for any server features
- Dev tooling: bun/npm, tsx, esbuild, TypeScript

Repository layout (important files)
- index.html — App entry HTML
- src/main.tsx — React bootstrap
- src/App.tsx — Main application (admin dashboard)
- src/* — components, context, data seeds (INITIAL_MOVIES, etc.)
- package.json — scripts and dependencies
- bun.lock — indicates Bun lockfile present
- vite.config.ts, tsconfig.json

Quick start (recommended)
1. Clone
   git clone https://github.com/starbest1159-pixel/Freedom.git
   cd Freedom

2. Install dependencies
   - Using Bun:
     bun install
   - Or using npm:
     npm install

3. Run development server
   - bun run dev
   - or npm run dev
   The app runs via Vite (script `dev` uses `vite --port=3000 --host=0.0.0.0`).

4. Build / Preview
   - npm run build
   - npm run preview

Useful scripts (from package.json)
- dev: vite --port=3000 --host=0.0.0.0
- build: vite build
- preview: vite preview
- clean: rm -rf dist server.js
- lint: tsc --noEmit

Environment
- The project includes `dotenv` as a dependency; create a `.env` file if you add environment-based configuration (TMDB API keys, EdgeOne credentials, etc.).

Notes
- Data is seeded from `src/data/initialData` and persisted to localStorage (e.g., `movieflix_movies`, `freedom_dual_sessions`).
- There is no README in the repo currently — this file is a suggested starting point.
- No license file found in the repository. If you want an open-source license added (MIT, Apache-2.0, etc.), tell me which one and I can add it.

Want me to create README.md in the repository now with this content? If you want changes (Thai copy, screenshots, badges, deployment instructions or a license), tell me what to include and I’ll add them.
