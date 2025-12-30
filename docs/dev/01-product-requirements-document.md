
# 1. Product Requirements Document (PRD) - NetStat Live

## 1.0 Overview
This document defines the product requirements for NetStat Live, a real-time netball statistics tracking application.

---

## 2.0 App Goal & Problem Statement

### 2.1 Goal
To provide coaches, players, and statisticians with a fast, accurate, and intuitive tool for recording, viewing, and analyzing netball game statistics in real-time for various formats of the game.

### 2.2 Problem Statement
Manual stat tracking for netball is often slow, prone to errors, and provides no immediate, actionable insights during a game. Existing digital solutions can be overly complex, expensive, or lack support for popular variations like Fast5 or 6-a-side netball. Coaches and teams need a tool that can keep up with the fast pace of the game and provide instant data to inform strategic decisions.

---

## 3.0 Target Users

*   **Coaches (Primary)**: Need to track player and team performance live to make in-game adjustments, substitutions, and post-game analyses.
*   **Statisticians / Team Managers**: Responsible for official record-keeping and providing detailed reports to the team.
*   **Players & Fans (Secondary)**: Interested in viewing live scores and post-game performance data.

---

## 4.0 Core Features

### 4.1 Minimum Viable Product (MVP) Features
*   **Game Setup Wizard**: Configure a new game by selecting teams, game format (7-a-side, 6-a-side, 5-a-side), venue, and quarter duration.
*   **Team & Player Management**: Create teams, add/edit/remove players from rosters, and set a captain.
*   **Live Game Tracking**:
    *   A real-time scoreboard with game clock, quarter, and scores.
    *   An interactive stat entry panel to record atomic stats (goals, misses, turnovers, etc.) with a single tap.
    *   Live game timer with start/pause/end functionality.
    *   Substitution management interface.
    *   Support for format-specific rules (e.g., Power Plays in 5-a-side, Super Shots).
*   **Post-Game Statistics**: View a detailed box score for each team and player after a game is completed.
*   **Game Persistence**: Save completed games to a competition (season/tournament) or as single games.

### 4.2 Future (Post-MVP) Features
*   **AI-Powered Game Analytics**: Generate narrative summaries and performance insights from game data (this feature is currently built but "parked").
*   **Advanced Player Profiles**: View career stats and performance trends for each player.
*   **Data Export**: Export game stats and history to CSV or PDF formats.
*   **Cloud Sync & Multi-User Access**: Allow multiple users to view or record stats for the same game and sync data across devices.

---

## 5.0 User Stories

*   **As a coach**, I want to set up a new game in under 1 minute, **so that** I can get started quickly before the match begins.
*   **As a stat keeper**, I want to record a goal with a single tap on the player and another on the "Goal" button, **so that** I can keep up with the fast pace of the game.
*   **As a coach**, I want to easily make and record substitutions during a break, **so that** my game history accurately reflects who was on court.
*   **As a team manager**, I want to view a detailed box score immediately after the game, **so that** I can prepare my post-game report.
*   **As a user**, I want the app to work offline during a game, **so that** I'm not dependent on a stable internet connection at the venue.
*   **As a coach**, I want to toggle which stats I track in the settings, **so that** I can simplify the interface to only what matters to my team.

---

## 6.0 Out of Scope (for now)

*   Live video streaming or recording.
*   Integration with social media platforms for sharing scores.
*   Advanced team scheduling or calendar features.
*   Wearable device integration.
*   In-app messaging or team communication features.

---

## 7.0 Success Metrics

*   **Speed**: A user can record a standard statistic (e.g., turnover) within 2 seconds of the event happening.
*   **Adoption**: An increase in the number of saved games week-over-week.
*   **Engagement**: >80% of games are tracked to completion.
*   **Accuracy**: Undo/correction feature usage is less than 5% of total stat entries, indicating high initial accuracy.
*   **Usability**: A new user can successfully set up and record a full game with no prior training.
