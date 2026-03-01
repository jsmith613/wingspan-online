# Setup Game Scenario

You are setting up a Wingspan game scenario for testing. The user will describe a game state in natural language.

## Your task

1. Parse the user's description into a scenario JSON matching the format below
2. Map bird common names to `BirdCardName` enum values (e.g., "Northern Cardinal" → `NORTHERN_CARDINAL`, "Blue Jay" → `BLUE_JAY`)
3. Map food names to `FoodType` enum values: `INVERTEBRATE`, `SEED`, `FISH`, `FRUIT`, `RODENT`, `WILD`
4. Map bonus card names to `BonusCardName` enum values (e.g., "Anatomist" → `ANATOMIST`)
5. Write the scenario to a JSON file and run the setup script
6. Restart the server and output the results

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

## Important notes

- **Always write the scenario to a JSON file** (e.g., `scripts/scenarios/my-scenario.json`) and pass the file path to the script. Do NOT pass inline JSON as a CLI argument — shell quoting issues will break it.
- **The server must be restarted** after inserting a game. The server uses sql.js which loads the SQLite DB into memory at startup, so it won't see games inserted by a separate process. After running the script, find and kill the existing server process, then restart it.
- **The client ignores `playerId` in the URL.** It always shows the view for whichever player the server says should provide input next (`expectedInputPlayerId`). The URL only needs `?gameId=<GAME_ID>`.
- When the user asks to test a bird with specific powers, look up its food cost in `src/server/cards/base/` and ensure the player has enough food in the scenario to pay for it (and any additional birds it triggers).

## Running the script

1. Write the scenario JSON to a file under `scripts/scenarios/`.

2. Run the setup script from the project root:
```bash
npx ts-node scripts/setup-scenario.ts scripts/scenarios/<name>.json
```

3. Restart the server so it picks up the new game. Find and kill the process listening on the server port (default 3000), then start fresh:
```bash
npx ts-node src/server/server.ts &
```

4. Verify the game loads:
```bash
curl -s http://localhost:3000/api/game/<GAME_ID> | head -5
```

## Output format

After running the script and restarting the server, present the results like this:

```
Game created successfully!

Game ID: <GAME_ID>
URL: http://localhost:3000?gameId=<GAME_ID>

Players:
- <NAME> (player_0)
- <NAME> (player_1)

Round: <ROUND>, Phase: <PHASE>
Current player: <NAME>
```

## User's scenario description

$ARGUMENTS
