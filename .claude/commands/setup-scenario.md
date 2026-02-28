# Setup Game Scenario

You are setting up a Wingspan game scenario for testing. The user will describe a game state in natural language.

## Your task

1. Parse the user's description into a scenario JSON matching the format below
2. Map bird common names to `BirdCardName` enum values (e.g., "Northern Cardinal" → `NORTHERN_CARDINAL`, "Blue Jay" → `BLUE_JAY`)
3. Map food names to `FoodType` enum values: `INVERTEBRATE`, `SEED`, `FISH`, `FRUIT`, `RODENT`, `WILD`
4. Map bonus card names to `BonusCardName` enum values (e.g., "Anatomist" → `ANATOMIST`)
5. Run the setup script
6. Output the results with clickable URLs

## Scenario JSON format

```json
{
  "players": [
    {
      "name": "Player 1",
      "food": ["SEED", "FISH"],
      "hand": ["NORTHERN_CARDINAL", "BLUE_JAY"],
      "bonusCards": ["ANATOMIST"],
      "actionCubes": 7,
      "board": {
        "FOREST": [{ "name": "EASTERN_BLUEBIRD", "eggs": 2 }],
        "GRASSLAND": [],
        "WETLAND": []
      }
    }
  ],
  "round": 2,
  "currentPlayerIndex": 0,
  "phase": "PLAYER_TURN",
  "birdfeeder": { "dice": ["SEED", "FISH", "INVERTEBRATE", "FRUIT", "RODENT"] },
  "birdTray": ["OSPREY", "CEDAR_WAXWING", "TREE_SWALLOW"],
  "seed": 42
}
```

### Field defaults
- `players[].name`: "Player 1", "Player 2", etc.
- `players[].food`: `[]`
- `players[].hand`: `[]`
- `players[].bonusCards`: `[]`
- `players[].actionCubes`: determined by round (Round 1=8, 2=7, 3=6, 4=5)
- `players[].board`: empty (all habitats `[]`)
- `round`: `1`
- `currentPlayerIndex`: `0`
- `phase`: `"PLAYER_TURN"`
- `birdfeeder`: random dice if omitted
- `birdTray`: drawn from deck if omitted
- `seed`: `Date.now()` if omitted

## Running the script

```bash
cd /c/Users/Josiah/wingspan && npx ts-node scripts/setup-scenario.ts '<SCENARIO_JSON>'
```

Or save to a file first and pass the path:
```bash
cd /c/Users/Josiah/wingspan && npx ts-node scripts/setup-scenario.ts scripts/scenarios/my-scenario.json
```

## Output format

After running the script, present the results like this:

```
Game created successfully!

Game ID: <GAME_ID>

Players:
- <NAME> (ID: <PLAYER_ID>): http://localhost:3000?gameId=<GAME_ID>&playerId=<PLAYER_ID>
- <NAME> (ID: <PLAYER_ID>): http://localhost:3000?gameId=<GAME_ID>&playerId=<PLAYER_ID>

Round: <ROUND>, Phase: <PHASE>
Current player: <NAME>
```

## User's scenario description

$ARGUMENTS
