# AGENTS.md - Coding Agent Guidelines

## Build/Test Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Run TypeScript type checking and generate route types
- `npm run start` - Start production server
- No test framework configured - verify changes manually

## Code Style Guidelines

### Imports & Structure

- Use ES6 imports: `import { Component } from "react-router"`
- Import from `react-router` for routing components (Link, useNavigate, etc.)
- Use `~/` alias for app directory imports: `import Component from "~/components/Component"`
- Import constants from `constants` directory without path prefix
- Group imports: React Router types first, then components, then hooks/utilities

### Components & Naming

- Use PascalCase for component names and files
- Export components as default exports
- Use arrow functions for functional components: `const Component = () => {}`
- Place component files in `app/components/`, route files in `app/routes/`

### TypeScript & Types

- Define interfaces in `types/index.d.ts` using PascalCase
- Use strict TypeScript settings - all types must be properly defined
- Use `type` imports for route types: `import type { Route } from "./+types/home"`
- Export route meta functions: `export function meta({}: Route.MetaArgs)`

### Styling & State

- Use Tailwind CSS classes exclusively with semantic names (`navbar`, `primary-button`, `main-section`)
- Use Zustand for state management (see `~/lib/puter.ts` for store patterns)
- Handle loading states with conditional rendering and loading indicators
