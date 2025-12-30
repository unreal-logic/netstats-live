
# 6. API / Integration Requirements - NetStat Live

## 1.0 Overview
This document outlines the requirements for all external services and APIs that NetStat Live integrates with. As of the current version, the primary external integration is with Google's Generative AI models via the Genkit framework.

---

## 2.0 Google AI (via Genkit)

### 2.1 Purpose
The application uses Google's AI models (specifically Gemini) to provide an "AI-Powered Game Analytics" feature. This feature takes the final statistics of a completed game and generates a structured, narrative summary.

### 2.2 Integration Point
*   **File**: `src/ai/flows/game-summary-flow.ts`
*   **Framework**: Genkit for Next.js (`@genkit-ai/next`, `@genkit-ai/google-genai`).

### 2.3 Core Flow: `gameSummaryFlow`
*   **Trigger**: This flow is manually triggered when a user navigates to the `/analytics` page for a specific game.
*   **Input**: A `GameSummaryInput` object, which includes:
    *   Team names and final scores.
    *   An array of player stats for each team (e.g., points, assists, rebounds, PIR).
    *   The game format (e.g., "7-a-side").
*   **Process**:
    1.  The flow formats the input data into a detailed text prompt.
    2.  This prompt is sent to the `googleai/gemini-2.5-flash` model.
    3.  The model is instructed to return a JSON object that matches the `GameSummarySchema`.
*   **Output**: A `GameSummary` object containing:
    *   `gameOverview`: A high-level text summary.
    *   `teamAnalysis`: Strengths and areas for improvement for both teams.
    *   `playerSpotlights`: Brief summaries of 2-3 standout player performances.

### 2.4 Authentication & Configuration
*   **Method**: API Key.
*   **Environment Variable**: The application requires a `GEMINI_API_KEY` to be present in the environment for the AI features to function.
*   **Genkit Initialization**: The Genkit instance is configured in `src/ai/genkit.ts` to use the Google AI plugin.

### 2.5 Data Sync Rules
*   The AI-generated summary is fetched on-demand.
*   Once fetched, the summary is cached within the `TeamContext` for the current session to avoid redundant API calls. It is stored on the corresponding `GameLog` object in the `aiSummary` field.
*   This cached data is persisted to `localStorage` along with the rest of the game data.

---

## 3.0 Other Integrations (None)
As of the current build, there are no other external API integrations. Future integrations might include:
*   **Cloud Database (e.g., Firestore)**: For syncing user and game data across devices. This would require robust authentication and data sync logic.
*   **Social Media APIs (e.g., X/Twitter)**: For sharing game results.
*   **Calendar APIs (e.g., Google Calendar)**: For scheduling matches.
