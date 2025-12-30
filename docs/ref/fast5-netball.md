# Fast5 Netball Rules & App Logic

## 1. How Power Plays work in Fast5 Netball

Fast5 is a shortened, high-scoring version of netball. Each team gets **Power Plays** that multiply their score.

### Core Power Play Rules

- Each team gets **two** Power Plays per match.
- A Power Play lasts **one full quarter**.
- Teams must declare their Power Play **before** the quarter starts.
- Power Plays **cannot** be used in the same quarter by both teams.

#### During a Power Play:

- All goals scored by the activating team are worth **DOUBLE**.
  - **1-point goals** become **2 points**.
  - **2-point super shots** become **4 points**.
- If a team does not call a Power Play, their goals score normally.

#### What Doesn’t Change:

- Only GS and GA can score.
- Shot distance rules stay the same.
- Missed shots score 0 points, even during a Power Play.

---

## 2. Designing Power Play Logic in a Stats App

You’re essentially dealing with a time-boxed scoring modifier.

### A. Core Data to Track

At a minimum, your data structure should look something like this:

```
Match
 ├── Quarters (1–4)
 │    ├── PowerPlayTeam (None | Team A | Team B)
 │    └── Shots
 │         ├── Player
 │         ├── ShotType (1pt | 2pt)
 │         ├── Made (true/false)
 │         └── Timestamp
```

### B. Power Play State Model

A simple state object per quarter is recommended:

```javascript
const PowerPlay = {
  quarter: 1,
  teamId: 'teamA',
  multiplier: 2
}
```

**Rules:**
- Only one `PowerPlay` object can exist per quarter.
- Each team can only have 2 total per match.
- The state must be locked once the quarter starts.

### C. Scoring Calculation Logic

When a shot is recorded, use logic like this:

```javascript
function calculatePoints(shot, currentQuarter, powerPlay) {
  if (!shot.made) {
    return 0;
  }

  let basePoints = shot.type === "2pt" ? 2 : 1;

  if (
    powerPlay &&
    powerPlay.quarter === currentQuarter &&
    powerPlay.teamId === shot.teamId
  ) {
    return basePoints * 2; // Apply multiplier
  }

  return basePoints;
}
```

### D. Recommended Stat Storage

For accurate analytics, store raw and derived stats separately.

- **Raw Stats:**
  - `Goals Made`
  - `Super Shots Made`
- **Derived Stats:**
  - `Base Points` (e.g., 8)
  - `Power Play Bonus` (e.g., +8)
  - `Total Points` (e.g., 16)

This allows you to analyze performance with and without the Power Play impact.

### E. UI/UX Recommendations

- **Pre-Quarter Selection:**
  - Show a toggle: “Activate Power Play this quarter?”
  - Disable if:
    - Team already used 2 Power Plays.
    - Opponent selected this quarter.
    - Quarter already started.
- **In-Game Indicators:**
  - 🔥 Power Play banner on the scoreboard.
  - Animated “×2” next to scores.
  - Confirmation popups: “Super Shot – 4 POINTS (Power Play)”.

### F. Edge Cases to Handle

| Scenario              | Handling                                          |
|-----------------------|---------------------------------------------------|
| Power Play selected late | Disallow after quarter timer starts.              |
| App crash mid-quarter | Persist the Power Play state to recover the game. |
| Stats export          | Include both base and bonus points.               |
| Admin correction      | Allow retroactive toggling to recalculate scores. |

### G. Suggested Database Schema

A simple relational database could use the following tables:
- `teams`
- `matches`
- `quarters`
- `shots`
- `players`
- `power_plays` (match_id, quarter, team_id, multiplier)

---

## 3. Future-Proofing Your App

To support custom rules or future formats, avoid hard-coding values. Use a configuration object instead.

```javascript
const rules = {
  powerPlayMultiplier: 2,
  powerPlayDuration: 'quarter', // or a time in seconds
  maxPowerPlays: 2
}
```
This makes it easy to adapt to variations like "5-minute power plays" or "3x multipliers" without rewriting your core logic.