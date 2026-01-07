# NetStats Live Blueprint

## Overview

NetStats Live is a real-time netball statistics tracking application. This blueprint outlines the project's current state and future development plans.

## Implemented Features

*   **Game Setup Wizard:** Configure new games (teams, format, venue, quarter duration).
*   **Team & Player Management:** Create and manage team rosters.
*   **Live Game Tracking:** Real-time scoreboard, game clock, stat entry, timer controls, substitutions, and format-specific rules.
*   **Post-Game Summary:** Detailed box scores for teams and players.
*   **Data Persistence:** Completed games are saved locally.

## Current Task: Create a New Players Page

**Goal:** To create a new page for managing players, including adding, editing, and deleting players.

**Plan:**

1.  **Create Player Context:**
    *   Create a new file `src/context/PlayerContext.tsx`.
    *   Define the `Player` type and the `PlayerContext`.
    *   Implement the `PlayerProvider` component with state management for players.
2.  **Create Players Page:**
    *   Create a new file `src/app/players/page.tsx`.
    *   Create a new file `src/app/players/columns.tsx`.
    *   Build the UI for the players page, including a data table to display the players.
    *   Implement functionality to add, edit, and delete players.
3.  **Update Navigation:**
    *   Add a link to the new players page in the main navigation.
