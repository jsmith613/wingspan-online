import { Game } from '../../../src/server/Game';
import { GameSetup } from '../../../src/server/GameSetup';
import { GameId } from '../../../src/common/Types';

/**
 * Helper for creating test games with deterministic state.
 */
export function createTestGame(
  playerNames: string[] = ['Alice', 'Bob'],
  seed: number = 42
): Game {
  const gameId = 'test_game_001' as GameId;
  return GameSetup.createGame(gameId, playerNames, seed);
}

/**
 * Create a test game and run through setup with default choices
 * (keep all birds, keep all food — no discard needed).
 */
export function createStartedGame(
  playerNames: string[] = ['Alice', 'Bob'],
  seed: number = 42
): Game {
  const game = createTestGame(playerNames, seed);
  game.startGame();

  // Each player keeps 0 birds (discards all) to skip food selection
  for (const player of game.players) {
    const birds = [...player.hand];
    game.handleSetupChoice(player.id, []); // keep no birds, keep all food
  }

  return game;
}
