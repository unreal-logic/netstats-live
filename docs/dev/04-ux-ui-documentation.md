
# 4. UX / UI Documentation - NetStat Live

## 1.0 Design Principles

*   **Speed First**: Interactions must be immediate. The primary goal is to keep up with a live game, so clicks must register instantly without lag.
*   **Touch-First**: The primary target device is a tablet. Buttons should be large and easy to tap.
*   **Clarity over Clutter**: The live game screen should prioritize essential information. Secondary actions or stats can be available but not immediately visible.
*   **Forgiving**: Mistakes are inevitable in a fast-paced environment. An "Undo" feature is critical and must be easily accessible.

---

## 2.0 User Flows

### 2.1 Starting a New Game
1.  **Landing Page (`/`)** -> User clicks "Start New Game".
2.  **New Game Wizard (`/new-game`)**
    *   User configures game format, teams, and other settings across 3 steps.
    *   User clicks "Start Game".
3.  **Live Game Screen (`/game`)** -> The configured game is loaded and ready to begin.

### 2.2 Recording a Stat
1.  **Live Game Screen (`/game`)** -> Game is `active`.
2.  User taps a stat button (e.g., "Turnover") in the `StatEntryPanel`.
3.  User taps a player on the court layout.
4.  The player's UI provides a brief visual confirmation (e.g., flash of color). The scoreboard updates if a goal was scored.

### 2.3 Viewing Post-Game Analytics
1.  **Live Game Screen (`/game`)** -> User clicks "End Game".
2.  **Post-Game Stats (`/post-game-stats`)** -> User is automatically redirected to the summary screen.
3.  User reviews the final score, quarterly breakdown, and team/player box scores.
4.  (Optional) User clicks "View Analytics".
5.  **Analytics Page (`/analytics`)** -> User views AI-generated report and charts.

---

## 3.0 Wireframes (Text-based)

### 3.1 Live Game Screen (`/game`) - Desktop Layout

```
+------------------------------------------+--------------------------------+
| [COLUMN 1 - Scrollable]                  | [COLUMN 2 - Sticky]            |
|                                          |                                |
| +--------------------------------------+ | +----------------------------+ |
| |        GameHeader (Scoreboard)     | | |       Tabs (History /      | |
| |    (Sticky within this column)     | | |          Team Stats)       | |
| +--------------------------------------+ | +----------------------------+ |
|                                          |                                |
| +--------------------------------------+ | +----------------------------+ |
| |        StatEntryPanel                | | |                            | |
| | (Player Layout & Stat Buttons)       | | |    Content for selected tab| |
| +--------------------------------------+ | |    (Scrollable)            | |
|                                          | |                            | |
|                                          | +----------------------------+ |
+------------------------------------------+--------------------------------+
```
*   **Interaction Note**: As the user scrolls `COLUMN 1`, the `GameHeader` becomes compact but remains visible at the top of the column, allowing the full `StatEntryPanel` to be seen. `COLUMN 2` remains in a fixed position.

### 3.2 Live Game Screen (`/game`) - Mobile Layout

```
+------------------------------------------+
|      AppHeader (Title & Nav)             |
+------------------------------------------+
|      GameHeader (Scoreboard)             |
|      (Sticky, compacts on scroll)        |
+------------------------------------------+
|                                          |
|      StatEntryPanel (Player Layout)      |
|      (Main content area)                 |
|                                          |
+------------------------------------------+
|      StatButtons (Fixed at bottom)       |
+------------------------------------------+
```
*   **Interaction Note**: The main content scrolls beneath the sticky `GameHeader`. The stat buttons are always accessible at the bottom of the viewport. The "History / Team Stats" content is accessible via a drawer (`AnalysisDrawer`).

---

## 4.0 Navigation Rules

*   The primary navigation is housed within a slide-out sidebar, accessible from the `AppHeader`.
*   The `AppHeader` is present on almost all pages and displays the current page's title.
*   The application does not use nested routes heavily. Navigation is mostly flat (e.g., `/dashboard`, `/competitions`, `/team-management`).
*   Game data is passed between `/game` and `/post-game-stats` via a shared `TeamContext`, not URL parameters, unless using the "Share" feature.
