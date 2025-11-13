# Project Guidance for 3D Chess

## Coding Conventions

- **Language & Target**: Write TypeScript targeting ESNext modules with `strict` mode enabled. Prefer `type`-only imports when values are not needed at runtime.
- **Formatting & Linting**: Use Biome (`bun run lint`) to enforce formatting and static analysis. Run `bun run lint --apply` before committing large changes to keep files auto-formatted.
- **React Components**: Declare `"use client"` in files that rely on browser APIs. Co-locate component-specific styles next to the component and keep shared tokens in `app/globals.css`.
- **Styling**: Tailwind CSS 4 provides component-level utilities. Use design tokens defined in `app/globals.css` for consistent backgrounds, borders, and typography.

## Architecture Notes

- **Routes**: Pages and API handlers live under `app/`. SSE endpoints for multiplayer reside in `app/api/game/*`.
- **Shared Logic**: Reusable UI and logic belong in `src/` (e.g., `src/lib/gameManager.ts`). Favor composable hooks and utility modules over deeply nested component hierarchies.
- **State Management**: The Game Manager is a singleton coordinating match state. Interactions with it should remain in server-side contexts or specialized API handlers.

## Testing & Tooling

- Use `bun test` for unit tests located in `tests/`. Follow existing patterns to mock SSE streams and the Game Manager when necessary.
- Validate builds with `bun run build` before shipping changes that affect routing, rendering, or configuration.
- Keep documentation updated when altering project structure or tooling so contributors understand the latest workflow.
