# NetStat Live: Statistics Overview

Based on the app's current implementation, here is a comprehensive list of the statistics that are being tracked.

We track two main types of statistics: **Atomic Stats** (raw events recorded during the game) and **Derived Stats** (calculated from the atomic stats).

## Atomic (Recordable) Stats

These are the individual events you can record for a player during a game:

### Shooting

- 1pt Goal Made
- 1pt Shot Missed
- 2pt Goal Made (Super Shot / Fast5)
- 2pt Shot Missed (Super Shot / Fast5)
- 3pt Goal Made (Fast5)
- 3pt Shot Missed (Fast5)

### Playmaking

- Pass
- Assist (final pass before a goal)
- Turnover (loss of possession)

### Defense & Possession

- Intercept
- Deflection
- Rebound (can be general or detailed)
  - Offensive Rebound
  - Defensive Rebound
- Pickup (recovering a loose ball)
- Penalty

## Derived (Calculated) Stats

These statistics are automatically calculated based on the atomic stats and provide deeper insights into performance. They are visible in the post-game summary and player box scores.

- **Points (PTS):** Total points scored by a player or team, including Power Play multipliers.
- **Shot Attempts (SA):** Total number of shots taken (made + missed).
- **Shooting Percentage (SH%):** The percentage of shots that were successful.
- **Gains:** A key defensive metric calculated as `Intercepts + Pickups + Offensive Rebounds`.
- **Goals from Gains:** The number of goals scored by a team within 10 seconds of a "gain" event. This measures transition offense efficiency.
- **Player Impact Rating (PIR):** An overall performance score calculated as `(Points + Assists + Gains + Rebounds) − (Turnovers + Penalties)`.
