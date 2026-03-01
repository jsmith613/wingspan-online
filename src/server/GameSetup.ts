import { GameId } from '../common/Types';
import { Game } from './Game';
import { MIN_PLAYERS, MAX_PLAYERS } from '../common/constants';
import { GameOptions } from '../common/models/GameOptions';

/**
 * Factory for creating and initializing new games.
 */
export class GameSetup {
  /**
   * Create a new game with the given player names.
   * @param playerNames Array of player name strings (2-5 players)
   * @param seed Optional seed for deterministic randomness
   * @returns A new Game instance ready for setup phase
   */
  static createGame(
    gameId: GameId,
    playerNames: string[],
    seed?: number,
    options?: GameOptions
  ): Game {
    if (playerNames.length < MIN_PLAYERS) {
      throw new Error(`Need at least ${MIN_PLAYERS} players, got ${playerNames.length}`);
    }
    if (playerNames.length > MAX_PLAYERS) {
      throw new Error(`Maximum ${MAX_PLAYERS} players, got ${playerNames.length}`);
    }

    const game = new Game(gameId, playerNames, seed, options);
    return game;
  }

  /**
   * Generate a unique game ID.
   */
  static generateGameId(): GameId {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 12; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id as GameId;
  }
}
