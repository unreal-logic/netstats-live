# Master Netball Stat Dictionary (Rule-Agnostic)

This dictionary defines every stat once, with metadata so rulesets can switch behaviour without changing the data model.

## A. Core Event Types (Atomic Events)

These are the only things you actually record live.

| Event Type   | Description                   | Used By            |
|--------------|-------------------------------|--------------------|
| Shot Attempt | Any shot at goal              | All formats        |
| Goal Made    | Successful shot               | All formats        |
| Missed Shot  | Unsuccessful shot             | All formats        |
| Pass         | Any completed pass            | Optional analytics |
| Assist       | Final pass before goal        | All formats        |
| Rebound      | Regather after miss           | WINA / Fast5       |
| Intercept    | Catch of opponent pass        | All formats        |
| Deflection   | Ball touched altering play    | All formats        |
| Pickup       | Loose ball recovery           | All formats        |
| Turnover     | Error causing possession loss | All formats        |
| Penalty      | Contact or obstruction        | All formats        |
| Substitution | Player on/off court           | +/- tracking       |

👉 *Everything else is derived.*

## B. Shot Event (Critical for Scoring)

Every shot must be recorded like this:

```json
{
  "event_type": "SHOT",
  "player_id": "P12",
  "team_id": "T1",
  "quarter": 2,
  "timestamp": "03:42",
  "shot_zone": "INNER | OUTER | UNKNOWN",
  "base_points": 1,
  "power_play_active": true,
  "final_points": 2,
  "outcome": "MADE | MISSED"
}
```

✔ Works for Fast5
✔ Still valid for WINA / Outdoor
✔ Future-proof

# Scoring Rules Engine (Per Format)

Your app should not hard-code scoring — it should reference a ruleset.

## A. Ruleset Configuration Object

```json
{
  "format": "FAST5",
  "shot_zones": {
    "INNER": 1,
    "OUTER": 2
  },
  "power_play": {
    "enabled": true,
    "multiplier": 2,
    "quarters_allowed": 1
  },
  "centre_pass": false,
  "continuous_play": true
}
```

## B. Scoring Calculation Logic (Pseudo-code)

```
IF shot_made:
    points = shot_zone_value
    IF power_play_active:
        points = points * power_play_multiplier
ELSE:
    points = 0
```

✔ Handles all netball variants
✔ No format-specific code elsewhere

# Derived Statistics (Automatically Calculated)

These stats are never manually entered.

## Individual Player (Derived)

| Stat         | Formula                                                   |
|--------------|-----------------------------------------------------------|
| Goals        | Count of shots made                                       |
| Points       | Sum of final_points                                       |
| Shot Attempts| Goals + Misses                                            |
| Shooting %   | Goals ÷ Attempts                                          |
| Assists      | Count                                                     |
| Rebounds     | Count                                                     |
| Gains        | Intercepts + Pickups + Rebound steals                     |
| PIR          | (Points + Assists + Gains + Rebounds) − (Turnovers + Penalties) |
| Efficiency (EFF) | (Points + Assists + Gains) − (Misses + Turnovers)     |
| Plus / Minus | Team points on − Opponent points on                     |

## Team (Derived)

| Stat               | Formula                       |
|--------------------|-------------------------------|
| Team Points        | Sum of player points          |
| Shooting %         | Team goals ÷ attempts         |
| Power Play Impact  | PP points − Opponent PP points|
| Transition Goals   | Goals within X sec of gain    |
| Time in Possession % | Team possession ÷ total time  |

# Minimum Stat Sets (By Level)

🟢 **Grassroots / Social**
- Goals
- Points
- Assists
- Turnovers
- Penalties

🔵 **Competitive / Indoor**
- All above
- Rebounds
- Gains
- Shooting %

🔴 **Elite / Analytics**
- Shot zones
- Power Play impact
- PIR
- +/-
- Efficiency

# Final Validation Checklist

| Requirement             | Covered |
|-------------------------|---------|
| Fast5 variable scoring  | ✅      |
| Power Plays             | ✅      |
| WINA rebounds & nets    | ✅      |
| Outdoor standard rules  | ✅      |
| Short quarters          | ✅      |
| Future rule changes     | ✅      |

## ✅ Final Recommendation (Key Takeaway)

- Record simple atomic events.
- Calculate everything else.
- Let the ruleset decide scoring.

This guarantees:
- Accuracy
- Scalability
- Zero rework when formats change
