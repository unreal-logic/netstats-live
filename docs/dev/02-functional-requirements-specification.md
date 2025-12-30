
# 2. Functional Requirements Specification (FRS) - NetStat Live

## 1.0 Feature: New Game Setup

### 1.1 Description
A multi-step wizard guides the user through configuring a new match.

### 1.2 Behavior & Logic
1.  **Step 1: Game Details**
    *   **Input**: User selects Game Format (`7-a-side`, `6-a-side`, `5-a-side`).
    *   **Input**: User selects Venue (optional, from a manageable list).
    *   **Input**: User selects Competition to save to (optional).
    *   **Input**: User adjusts Quarter Duration (defaults based on format).
    *   **Logic**: If format is `7-a-side`, a "Super Shot" toggle is displayed.
2.  **Step 2: Select Teams**
    *   **Input**: User selects Team A and Team B from a list of pre-configured teams.
    *   **Validation**: Team A and Team B cannot be the same.
    *   **Input**: User selects Tracking Mode (`Both Teams` or `Single Team`).
    *   **Logic**: If `Single Team` is chosen, a dropdown appears to select which of the two teams is the primary team to track.
3.  **Step 3: Review & Start**
    *   **Output**: A summary of all selected settings is displayed.
    *   **Action**: On "Start Game", the application transitions to the Live Game screen (`/game`).

### 1.3 Edge Cases
*   If no teams are created, the "Select Teams" step will prompt the user to create one.
*   If the user backs out of the wizard, their selections are discarded.

---

## 2.0 Feature: Live Stat Recording

### 2.1 Description
The main interface for real-time game tracking.

### 2.2 Behavior & Logic
1.  **State Machine**: The game can be in one of the following states: `not-started`, `active`, `paused`, `finished`, `overtime-ready`.
2.  **Timer Controls**:
    *   **Input**: User presses "Start Game" (or "Resume", "Start Quarter").
    *   **Logic**: Game state becomes `active`. The timer begins counting down from the configured duration. Stat buttons become active.
    *   **Input**: User presses "Pause".
    *   **Logic**: Game state becomes `paused`. Timer stops. Stat buttons are disabled.
3.  **Stat Entry**:
    *   **Input**: User taps a stat button (e.g., "Turnover").
    *   **Logic**: The button becomes highlighted, indicating it's the `selectedStat`.
    *   **Input**: User taps a player on the court layout.
    *   **Validation**: The system checks if the selected player is eligible to be assigned that stat based on their position and game format (e.g., only `GS`/`GA` can be assigned shooting stats).
    *   **Output**: If valid, a `StatLogEntry` is created with timestamp, quarter, player ID, and stat type. The scoreboard and any relevant player stats are updated instantly. The `selectedStat` is cleared.
    *   **Error Handling**: If invalid, a toast notification appears explaining why (e.g., "Only GS or GA can take a shot.").
4.  **End of Quarter**:
    *   **Logic**: When the timer reaches `00:00`, the game state automatically becomes `paused`.
    *   **Action**: A "Next Quarter" button appears.

### 2.3 Edge Cases
*   **Tie Game**: If "End Game" or "Next Quarter" is pressed after Q4 and scores are tied, the state becomes `overtime-ready`, prompting the user to start an overtime period.
*   **Undo**: The "Undo" button removes the most recent `StatLogEntry`. If the entry was a goal, the score and next centre pass possession are correctly reverted.

---

## 3.0 Feature: Substitution Management

### 3.1 Description
An overlay for managing player positions on the court and bench.

### 3.2 Behavior & Logic
1.  **Activation**:
    *   **Input**: User taps the "Substitutions" button on the stat entry panel.
    *   **Output**: A full-screen overlay or large dialog appears, showing players on court and on the bench for both teams.
2.  **Making a Swap**:
    *   **Input**: User taps the first player to be swapped.
    *   **Logic**: The player's card is highlighted.
    *   **Input**: User taps the second player (either on court or bench).
    *   **Logic**: The system swaps the `courtPosition` attributes of the two selected players. The visual representation updates immediately. The selection is cleared.
3.  **Confirmation**:
    *   **Input**: User taps the "Confirm Changes" button.
    *   **Output**: A `substitution` entry is added to the `statLog`, recording the details of the swap. The overlay closes, and the main game screen reflects the new lineup.
    *   **Validation**: The "Confirm Changes" button is only enabled if at least one swap has been made.
4.  **Cancellation**:
    *   **Input**: User taps "Cancel" or closes the overlay.
    *   **Logic**: All pending swaps are discarded. The lineup reverts to its state before the overlay was opened.
