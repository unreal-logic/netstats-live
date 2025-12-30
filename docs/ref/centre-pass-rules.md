# Understanding the Centre Pass in 7-a-side Netball

The centre pass is the action that starts play at the beginning of each quarter and restarts it after a goal has been scored. Understanding its rules is crucial for game flow and strategy.

## Key Rules of the Centre Pass

1.  **Alternating Possession**: This is the most important rule. The centre pass alternates between the two teams, **regardless of which team scored the last goal**.
    -   The first centre pass of the game is determined by a coin toss.
    -   The team that did not take the first centre pass will take the first centre pass of the second quarter.
    -   This alternating sequence continues for every quarter and after every goal.

2.  **The Taker**: The pass is always taken by the **Centre (C)** player.

3.  **Positioning of the Centre**:
    -   The Centre must have at least one foot completely inside the centre circle before the whistle is blown.
    -   They must throw the ball within **3 seconds** of the umpire's whistle.
    -   They cannot step out of the centre circle until the ball has been released.

4.  **Positioning of Other Players**:
    -   Before the whistle, all players must be in their respective goal thirds and must not enter the centre third.
    -   The opposing Centre player is allowed in the centre third but must be at least 3 feet (0.9m) away from the Centre taking the pass.
    -   No player is allowed to move from their position until the umpire blows the whistle to start play.

## The Sequence of Play

1.  Umpire checks all players are in position.
2.  Umpire blows the whistle to start or restart play.
3.  The Centre passes the ball.
4.  The ball must be touched or caught by a player who is standing in, or lands in, the centre third.

## Common Infringements

-   **Breaking**: A player moving from their designated goal third into the centre third before the whistle. This results in a free pass to the opposing team.
-   **Not in the Circle**: The passing Centre not having a foot fully inside the circle.
-   **Held Ball**: The Centre not passing the ball within 3 seconds.
-   **Incorrect Pass**: The ball not being touched or caught by a player within the centre third.

## App Logic Implications

When tracking game flow, the app must maintain a state variable that tracks which team is due to take the next centre pass.

```javascript
// Pseudo-code for tracking next centre pass
let nextCentrePassTeam = 'Team A'; // Determined by coin toss

function onGoalScored(scoringTeam) {
    // Record the goal...
    // The next pass belongs to the team in the sequence, NOT the non-scoring team
    takeCentrePass(nextCentrePassTeam);

    // Alternate for the next time
    nextCentrePassTeam = (nextCentrePassTeam === 'Team A') ? 'Team B' : 'Team A';
}

function onQuarterStart(quarterNumber) {
    // Team A starts Q1 & Q3, Team B starts Q2 & Q4 (assuming Team A won toss)
    const startingTeam = (quarterNumber % 2 === 1) ? 'Team A' : 'Team B';
    takeCentrePass(startingTeam);
    nextCentrePassTeam = (startingTeam === 'Team A') ? 'Team B' : 'Team A';
}
```

This alternating system is a core principle of netball that ensures a balanced distribution of possession opportunities.
