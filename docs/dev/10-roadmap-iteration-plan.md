
# 10. Roadmap & Iteration Plan - NetStat Live

This document outlines the phased development plan for the application, starting from the current state and looking toward future enhancements.

---

## Phase 1: Core Stat-Tracking Engine (Completed)

This phase focused on building the fundamental tools required for live game tracking.

*   ✅ **Features:**
    *   New Game Wizard for match setup.
    *   Team and Player roster management.
    *   Real-time stat entry panel with configurable buttons.
    *   Live scoreboard with game timer.
    *   Substitution management.
    *   Post-game box score and history view.
    *   Support for 7-a-side, 6-a-side, and 5-a-side formats.
    *   Full offline functionality via `localStorage`.
*   **Goal**: Prove the core concept and create a functional tool for a single user on a single device.

---

## Phase 2: Analytics & Usability Enhancements (Current / Next)

This phase focuses on adding value through data analysis and improving the user experience.

*   ▶️ **AI-Powered Game Analytics**:
    *   **Status**: Partially implemented but "parked" (`/analytics` page).
    *   **Task**: Re-integrate the "View Analytics" button onto the post-game screen and ensure the Genkit flow is robust.
*   ▶️ **Advanced Statistics & Charting**:
    *   **Task**: Create a dedicated "Aggregate Stats" page for competitions.
    *   **Task**: Add more data visualizations (charts, graphs) to the post-game and analytics pages to make data easier to interpret.
*   ▶️ **Data Export**:
    *   **Task**: Implement "Export to CSV" functionality for game history and player stats tables.
*   ▶️ **Enhanced User Settings**:
    *   **Task**: Allow users to create and manage their own list of venues.
    *   **Task**: Implement "Favorite" toggles for teams, competitions, and venues for quick access.

---

## Phase 3: Player-Centric Features

This phase shifts focus from single games to long-term player development and history.

*   **Player Profiles**:
    *   **Epic**: Create a new section of the app where users can view a dedicated profile for each player.
    *   **User Story**: As a coach, I want to see a player's complete stat history across all games and competitions, so I can track their development over time.
*   **Career Statistics**:
    *   **Task**: Calculate and display career averages, personal bests, and performance trends.
*   **Shot Charts**:
    *   **Epic**: Introduce a visual way to track shot locations for shooting analysis. (This would require significant changes to the stat entry process).

---

## Phase 4: Cloud Sync & Collaboration

This phase transitions the app from a local, single-user tool to a collaborative, multi-device platform. **This is a major architectural shift.**

*   **User Authentication**:
    *   **Epic**: Implement a full authentication system using Firebase Authentication (Google/Apple sign-in).
*   **Cloud Database**:
    *   **Epic**: Migrate data storage from `localStorage` to a cloud database like Firestore.
    *   **Task**: Develop a data synchronization strategy to handle online/offline updates.
*   **Multi-User "Club" Accounts**:
    *   **Epic**: Introduce role-based access control (Admin, Coach, Player) to allow a single organization to manage multiple teams and users under one account.
