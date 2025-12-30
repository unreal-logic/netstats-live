# Deferred Features

This document tracks features that have been built but are currently "parked" or disabled in the UI. This allows us to preserve the work and easily re-integrate these features in a future phase.

## 1. AI-Powered Game Analytics

- **Status**: Parked (Phase 1)
- **Description**: An AI-driven feature that provides a detailed narrative summary and analysis of a completed game. It generates insights on team performance, highlights key player contributions, and offers a high-level overview of the match.

### UI Entry Point (Currently Removed)

- A "View Analytics" button was located in the header of the post-game statistics page (`/post-game-stats`).
- This button linked to the `/analytics` route.

### Core Files to Keep

To preserve this feature, the following files should **not** be deleted:

1.  **`src/app/analytics/page.tsx`**: The main page component that displays the AI-generated report, including various charts and text analysis sections.
2.  **`src/ai/flows/game-summary-flow.ts`**: The Genkit AI flow responsible for taking game statistics as input and generating the structured JSON summary.
3.  **`src/ai/dev.ts`**: This file imports the `game-summary-flow` and should be kept to ensure the flow is registered with Genkit.

### How to Re-enable

1.  **Re-add the Button**: In `src/app/post-game-stats/page.tsx`, add the following code back into the header's button group:

    ```tsx
    import Link from 'next/link';
    import { BrainCircuit } from 'lucide-react';

    // In the header, add:
    <Link href="/analytics">
        <Button>
            <BrainCircuit className="mr-2 h-4 w-4" />
            View Analytics
        </Button>
    </Link>
    ```

2.  **Verify Dependencies**: Ensure that all dependencies for Genkit and the Google AI provider are still present in `package.json`.

3.  **Test**: Navigate to the post-game screen after a game and click the re-enabled button to ensure the analytics page loads and generates a report as expected.
