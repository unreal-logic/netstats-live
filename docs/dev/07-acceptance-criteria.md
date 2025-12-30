
# 7. Acceptance Criteria & Test Scenarios - NetStat Live

This document defines the criteria for when a feature is considered "done" and provides BDD-style test scenarios.

---

## 1.0 Feature: Live Stat Recording

### 1.1 Scenario: Recording a valid goal
*   **Given** the game is `active`
*   **And** the "1pt Goal" stat is selected
*   **When** I tap on the "Goal Shooter" (GS) player
*   **Then** the team's score should increment by 1
*   **And** the GS player's `points`, `goalsMade`, and `shotAttempts` stats should each increment by 1
*   **And** a "goalMade1pt" event should be added to the `statLog`
*   **And** the `selectedStat` should be cleared (the button is no longer highlighted)
*   **And** the next centre pass possession should switch to the opposing team.

### 1.2 Scenario: Recording an invalid stat
*   **Given** the game is `active`
*   **And** the "1pt Goal" stat is selected
*   **When** I tap on the "Centre" (C) player
*   **Then** the team's score should not change
*   **And** no entry should be added to the `statLog`
*   **And** a toast notification should appear with the message "Only GS or GA can take a shot."

### 1.3 Scenario: Using the Undo feature
*   **Given** I have just recorded a "Turnover" for a player
*   **When** I tap the "Undo" button
*   **Then** the "Turnover" entry should be removed from the `statLog`
*   **And** the player's turnover count should decrement by 1
*   **And** a toast notification should appear confirming the undo action.

---

## 2.0 Feature: Game Setup & Configuration

### 2.1 Scenario: Setting up a standard 7-a-side game
*   **Given** I am on the New Game wizard
*   **When** I select "7-a-side" format, "Vibrant Vixens" as Team A, and "Dynamic Diamonds" as Team B
*   **And** I proceed to the final step and click "Start Game"
*   **Then** I should be navigated to the `/game` page
*   **And** the scoreboard should display the correct team names
*   **And** the court layout should show 7 players per side with standard positions (GS, GA, etc.).

### 2.2 Scenario: Enabling a stat in settings
*   **Given** the "Block" stat is disabled for "7-a-side" games in the settings
*   **When** I navigate to the settings page and toggle the "Block" stat ON for "7-a-side"
*   **And** I start a new "7-a-side" game
*   **Then** the "Block" button should be visible in the `StatEntryPanel`.

### 2.3 Scenario: Disabling a stat in settings
*   **Given** the "Deflection" stat is enabled for "7-a-side" games
*   **When** I navigate to the settings page and toggle the "Deflection" stat OFF
*   **And** I start a new "7-a-side" game
*   **Then** the "Deflection" button should NOT be visible in the `StatEntryPanel`.

---

## 3.0 Feature: Post-Game Analysis

### 3.1 Scenario: Viewing the box score
*   **Given** a game has just been completed
*   **When** I am on the `/post-game-stats` page
*   **Then** the final score should be correctly displayed
*   **And** the player stats table should show aggregated totals for all players who participated
*   **And** the team totals in the table footer should match the sum of the individual player stats.
