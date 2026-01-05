
# 8. Technical Constraints & Preferences - NetStats Live

This document outlines the technical stack, architectural decisions, and other constraints for the project.

---

## 1.0 Core Technology Stack

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **UI Components**: shadcn/ui
*   **Styling**: Tailwind CSS
*   **State Management**: React Context API (`useContext`)
*   **AI Integration**: Genkit
*   **Icons**: `lucide-react`
*   **Forms**: `react-hook-form`

**Constraint**: The core technology stack is fixed. Do not introduce alternative frameworks like Angular, Vue, or other CSS libraries like Bootstrap or Material UI.

---

## 2.0 Architecture & Patterns

*   **Client-Side Rendering (CSR)**: The application is primarily a single-page application (SPA). Most components are client components (`'use client'`).
*   **Server Components**: Server components are to be used where appropriate, primarily for static pages or data fetching that doesn't require client-side interactivity.
*   **Component-Based Architecture**: The UI is built from small, reusable components, primarily sourced from `shadcn/ui` and located in `src/components/`.
*   **Global State**: All application state (teams, game settings, stat logs, etc.) is managed within a single global `TeamContext`. This serves as the single source of truth.
*   **Local Persistence**: The entire application state is persisted to the browser's `localStorage` to enable offline use and session restoration. There is no backend database in the current architecture.
*   **Server Actions**: Server Actions are the preferred method for any form submissions or data mutations that might eventually interact with a backend, though they are minimally used in the current client-side-heavy architecture.

---

## 3.0 Hosting & Deployment

*   **Platform**: Firebase App Hosting.
*   **Configuration**: All hosting configuration is managed via the `apphosting.yaml` file.
*   **Build Process**: The application is built using `next build`.

---

## 4.0 Code Style & Conventions

*   **Imports**: Use absolute imports with the `@/` alias (e.g., `import { Button } from '@/components/ui/button';`).
*   **Styling**: Use `tailwind-merge` and `clsx` (via the provided `cn` utility) for combining CSS classes. Do not use inline styles unless absolutely necessary.
*   **Icons**: Exclusively use icons from the `lucide-react` library. If an icon is not available, an inline SVG can be used as a fallback, but do not add other icon libraries.
*   **Comments**: Do not add comments to `package.json` or `globals.css`. Code should be self-documenting where possible.

---

## 5.0 AI Limitations & Guidelines

*   **File Generation**: The AI is not capable of generating binary files (e.g., images, favicons). Placeholder images must be sourced from `picsum.photos`.
*   **Command Execution**: The AI cannot run shell commands. It can only propose file changes. Any necessary package installations resulting from `package.json` modifications are handled automatically by the environment.
