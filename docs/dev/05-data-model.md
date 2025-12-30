
# 5. Data Model / Domain Model - NetStat Live

This document outlines the core data entities, their attributes, and their relationships within the NetStat Live application.

---

## 1.0 Core Entities

*   **Team**: Represents a netball team.
*   **Player**: Represents an individual player belonging to a team.
*   **GameLog**: A record of a completed game.
*   **StatLogEntry**: A single event (atomic stat or substitution) that occurred during a game.
*   **Competition**: A collection of games, such as a season or tournament.
*   **Venue**: A location where a game is played.

---

## 2.0 Entity Definitions

### 2.1 **Team**
Represents a collection of players.

| Attribute   | Type            | Description                               | Constraints      |
|-------------|-----------------|-------------------------------------------|------------------|
| `name`      | `string`        | The unique name of the team.              | **Primary Key**, Unique |
| `players`   | `Player[]`      | An array of players on the team's roster. |                  |
| `captainId` | `number | null`  | The ID of the player designated as captain. | Optional         |
| `isFavorite`| `boolean`       | Whether the team is marked as a favorite. | Optional         |

### 2.2 **Player**
Represents a single athlete.

| Attribute   | Type                               | Description                               | Constraints      |
|-------------|------------------------------------|-------------------------------------------|------------------|
| `id`        | `number`                           | A unique identifier for the player.       | **Primary Key**  |
| `name`      | `string`                           | The full name of the player.              | Not Null         |
| `gender`    | `'male' | 'female' | 'other'`     | The gender of the player.                 |                  |
| `positions` | `{ 7-a-side, 6-a-side, 5-a-side }` | An object mapping a default position for each game format. | Position can be `null` |
| `stats`     | `PlayerStats`                      | An object holding aggregated stats (deprecated for live games, used for static data). | |

### 2.3 **GameLog**
Represents a single saved game record.

| Attribute     | Type             | Description                                     | Constraints      |
|---------------|------------------|-------------------------------------------------|------------------|
| `gameId`      | `string`         | A unique identifier for the game log.           | **Primary Key**  |
| `date`        | `string`         | ISO 8601 timestamp of when the game was played. | Not Null         |
| `settings`    | `GameSettings`   | The settings object used to configure the game. | Not Null         |
| `statLog`     | `StatLogEntry[]` | The complete event log for the game.            | Not Null         |
| `finalScore`  | `object`         | The final score `{ teamA: number, teamB: number }`. | Not Null |
| `aiSummary`   | `GameSummary | null` | The cached AI-generated analysis of the game.   | Optional |

### 2.4 **StatLogEntry**
The atomic unit of game data. This is a discriminated union.

**Base Attributes**
| Attribute   | Type       | Description                        |
|-------------|------------|------------------------------------|
| `timestamp` | `number`   | Unique JS timestamp for the event. |
| `quarter`   | `number`   | The quarter in which the event occurred. |
| `gameTime`  | `number`   | The value of the game clock when the event occurred. |
| `stat`      | `string`   | The type of event.                 |

**For `StatLogEvent` (`stat` is a `StatType`)**
| Attribute    | Type      | Description                        |
|--------------|-----------|------------------------------------|
| `teamName`   | `string`  | The name of the team who performed the action. |
| `playerId`   | `number`  | The ID of the player who performed the action. `-1` for opposition. |
| `points`     | `number`  | Points scored from this event (0 for non-scoring stats). |
| `isPowerPlay`| `boolean` | Whether a power play was active for this event. |

**For `SwapLogEvent` (`stat` is `'substitution'`)**
| Attribute                 | Type       | Description                        |
|---------------------------|------------|------------------------------------|
| `player1Id`, `player1Name`, `player1OriginalPosition`, `player1NewPosition` | `number`, `string`, `Position` | Details for the first player in the swap. |
| `player2Id`, `player2Name`, `player2OriginalPosition`, `player2NewPosition` | `number`, `string`, `Position` | Details for the second player in the swap. |

### 2.5 **Competition**
A group of games.

| Attribute     | Type          | Description                                  | Constraints     |
|---------------|---------------|----------------------------------------------|-----------------|
| `id`          | `string`      | A unique identifier for the competition.     | **Primary Key** |
| `name`        | `string`      | The name of the competition (e.g., "Winter 2024 Season"). | |
| `type`        | `'season' | 'tournament'` | The type of competition. | |
| `games`       | `GameLog[]`   | An array of completed games in this competition. | |
| `isFavorite`  | `boolean`     | Whether the competition is marked as a favorite. | Optional |

### 2.6 **Venue**
A physical location for games.

| Attribute     | Type          | Description                                  | Constraints     |
|---------------|---------------|----------------------------------------------|-----------------|
| `id`          | `string`      | A unique identifier for the venue.           | **Primary Key** |
| `name`        | `string`      | The name of the venue (e.g., "City Arena").  | |
| `isFavorite`  | `boolean`     | Whether the venue is marked as a favorite.   | Optional |

---

## 3.0 Relationships

*   A **Team** has many **Players**. (One-to-Many)
*   A **Competition** has many **GameLogs**. (One-to-Many)
*   A **GameLog** belongs to one **Competition**. (Many-to-One, via `games` array)
*   A **GameLog** involves two **Teams** (referenced by `name` in `GameSettings`).
*   A **StatLogEntry** belongs to one **GameLog** (via `statLog` array).
*   A **StatLogEntry** is associated with one **Player** (via `playerId`).
*   A **GameLog** is associated with one **Venue** (referenced by `name` in `GameSettings`).
