import { Router, Request, Response } from 'express';
import { GameId } from '../../common/Types';
import { GameSetup } from '../GameSetup';
import { Game } from '../Game';
import { IDatabase } from '../database/IDatabase';
import { registerPlayerGameMapping } from './PlayerRoute';

/**
 * In-memory map of active games keyed by GameId.
 * Games are loaded from DB on demand and kept alive for the session.
 */
const activeGames = new Map<GameId, Game>();

export function createApiRouter(db: IDatabase): Router {
  const router = Router();

  /** POST /api/game - Create a new game */
  router.post('/game', (req: Request, res: Response) => {
    try {
      const { playerNames, options } = req.body as { playerNames: string[]; options?: import('../../common/models/GameOptions').GameOptions };
      if (!Array.isArray(playerNames) || playerNames.length < 2) {
        res.status(400).json({ error: 'playerNames must be an array with at least 2 entries' });
        return;
      }

      const gameId = GameSetup.generateGameId();
      const game = GameSetup.createGame(gameId, playerNames, undefined, options);

      // Start the game (deals cards, begins setup phase)
      game.startGame();

      // Persist and cache
      db.saveGame(game.serialize());
      activeGames.set(gameId, game);

      // Register player->game mapping
      const playerIds = game.players.map(p => p.id);
      registerPlayerGameMapping(playerIds, gameId);

      res.json({
        gameId: game.id,
        playerIds,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  /** GET /api/game/:id - Get current game state */
  router.get('/game/:id', (req: Request, res: Response) => {
    try {
      const gameId = req.params.id as GameId;
      const game = getGame(gameId, db);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }
      res.json(game.toViewModel());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

/** Helper: get a Game from cache or DB */
export function getGame(gameId: GameId, db: IDatabase): Game | undefined {
  let game = activeGames.get(gameId);
  if (game) {
    registerPlayerGameMapping(game.players.map(p => p.id), gameId);
    return game;
  }

  const data = db.loadGame(gameId);
  if (!data) return undefined;

  game = Game.deserialize(data);
  activeGames.set(gameId, game);
  registerPlayerGameMapping(game.players.map(p => p.id), gameId);
  return game;
}

/** Helper: save a game after mutation */
export function saveGame(game: Game, db: IDatabase): void {
  db.saveGame(game.serialize());
}
