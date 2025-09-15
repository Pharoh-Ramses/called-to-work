# AGENTS.md - Coding Agent Guidelines

## Build/Test Commands

- `npm run dev` - Start development server (React Router v7 + Vite)
- `npm run build` - Build for production
- `npm run typecheck` - Run TypeScript type checking and generate route types
- `npm run start` - Start production server
- No test framework configured - verify changes manually

## Code Style Guidelines

### Imports & Structure

- Use ES6 imports with `~/` alias for app directory: `import Component from "~/components/Component"`
- Group imports: React Router types first, then components, then hooks/utilities
- Import constants from `constants` directory without path prefix
- Use `type` imports for route types: `import type { Route } from "./+types/home"`

### Components & Naming

- Use PascalCase for component names and files
- Export components as default exports
- Use arrow functions for functional components: `const Component = () => {}`
- Place component files in `app/components/`, route files in `app/routes/`
- Export route meta functions: `export function meta({}: Route.MetaArgs)`

### Reusable Components

- **Button**: `<Button variant="primary|auth|back|secondary" size="sm|md|lg|xl" as="button|link" to="..." />`
- **Card**: `<Card variant="default|gradient|auth" padding="sm|md|lg|xl" />`
- **PageHeader**: `<PageHeader title="..." subtitle="..." />`
- **Typography**: `<GradientText>`, `<Heading level={1-6} gradient>`, `<Text variant="primary|secondary|muted|accent">`

### TypeScript & Types

- Define interfaces in `types/index.d.ts` using PascalCase
- Use strict TypeScript settings - all types must be properly defined
- Use `clsx` for conditional class names: `clsx(isDark ? "dark-bg" : "light-bg")`
- Handle loading states with conditional rendering and loading indicators

### Styling & State

- Use Tailwind CSS classes exclusively with semantic names (`navbar`, `primary-button`, `main-section`)
- Dark mode only - no light/dark mode toggle
- No background images - clean solid backgrounds
- Use Zustand for state management (see `~/lib/puter.ts` for store patterns)
- Use `useCallback` for event handlers to prevent unnecessary re-renders
- Use `useEffect` for side effects with proper dependency arrays

### Error Handling & Best Practices

- Use optional chaining (`?.`) for safe property access
- Handle async operations with try/catch blocks
- Use console.log for debugging (remove before production)
- Validate file uploads and user inputs
