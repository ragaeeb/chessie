# 3D Chess

[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/0df08abe-0892-405c-901d-684ff8cb7af1.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/0df08abe-0892-405c-901d-684ff8cb7af1)
[![codecov](https://codecov.io/gh/ragaeeb/3d-chess/graph/badge.svg?token=5DKNZ728JV)](https://codecov.io/gh/ragaeeb/3d-chess)

An immersive multiplayer 3D chess experience built with Next.js 16 and Bun. The project combines the frontend and backend into a single Next.js application that streams real-time updates through Server-Sent Events (SSE).

## Tech Stack

- **Next.js 16** (App Router) for pages and API routes.
- **React 19** for UI composition.
- **Three.js** and **@react-three/fiber** for the interactive 3D board.
- **Tailwind CSS 4** for utility-first styling.
- **Bun** for dependency management and scripts.
- **Biome** for linting and formatting.
- **Bun test** and **chess.js** powering the multiplayer engine and unit tests.

## Repository Structure

- `app/` – Next.js routes, including SSE endpoints under `app/api/game/*`.
- `src/` – Shared React components, utilities, and types.
- `public/` – Static assets served by Next.js.
- `tests/` – Bun-based unit tests for API routes and the game manager.
- `tailwind.config.ts` – Tailwind CSS configuration targeting v4.
- `postcss.config.js` – PostCSS pipeline using `@tailwindcss/postcss`.
- `frontend/` & `server/` – Legacy packages retained only for their lockfiles' node_modules caches; they are not part of the active application.

## Getting Started

1. Install dependencies with [Bun](https://bun.sh):

   ```bash
   bun install
   ```

2. Run the development server:

   ```bash
   bun run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the app. Navigate to `/game` to join a multiplayer match.

## Quality Checks

- `bun run lint` – run Biome static analysis and formatting checks.
- `bun test` – execute unit tests for the GameManager and API routes.
- `bun run build` – create a production build using the Next.js compiler.

## Coding Conventions

- TypeScript targets **ESNext** modules with strict type checking enabled.
- Use Biome formatting (`bun run lint --apply`) to maintain consistent style.
- Prefer type-only imports when values are not required at runtime.
- Client components should explicitly declare `"use client"` when accessing browser-only APIs.
- Use Tailwind CSS utilities for component-level styling and CSS variables in `app/globals.css` for shared tokens.

## Multiplayer Flow

Players join a queue through `POST /api/game/join`. Once paired, the shared `GameManager` coordinates turns and emits updates through SSE streams opened at `GET /api/game/stream`. Client components consume these events to render the board, animate moves, and surface match status updates.
