import { Router, Request, Response } from 'express';
import { PlayerId, GameId } from '../../common/Types';
import { InputType } from '../../common/input/InputType';
import { IDatabase } from '../database/IDatabase';
import { getGame, saveGame } from './ApiRoute';

/**
 * Maps player IDs to their game IDs for quick lookup.
 * Populated when games are created or loaded.
 */
const playerGameMap = new Map<PlayerId, GameId>();

export function registerPlayerGameMapping(playerIds: PlayerId[], gameId: GameId): void {
  for (const pid of playerIds) {
    playerGameMap.set(pid, gameId);
  }
}

export function createPlayerRouter(db: IDatabase): Router {
  const router = Router();

  function buildViewerGameView(game: any, req: Request) {
    const deviceId = req.query.deviceId as string | undefined;
    const viewerPlayerId = game.getPlayerIdForDevice?.(deviceId) || null;
    const vm = game.toViewModel(viewerPlayerId || undefined);
    const waitingFor = viewerPlayerId ? game.getWaitingForPlayer?.(viewerPlayerId) : null;
    (vm as any).waitingFor = waitingFor ?? null;
    return vm;
  }

  function resolveGameForPlayer(req: Request, playerId: PlayerId) {
    let gameId = playerGameMap.get(playerId);

    // Recovery path: after server restart, in-memory map is empty.
    // If client provides gameId, validate and rebuild mapping.
    if (!gameId) {
      const queryGameId = req.query.gameId as string | undefined;
      if (queryGameId) {
        const game = getGame(queryGameId as GameId, db);
        if (game && game.players.some((p) => p.id === playerId)) {
          registerPlayerGameMapping(game.players.map((p) => p.id), queryGameId as GameId);
          gameId = queryGameId as GameId;
        }
      }
    }

    if (!gameId) {
      return null;
    }

    const game = getGame(gameId, db);
    if (!game) {
      return null;
    }

    return { gameId, game };
  }

  /** GET /api/player/:id/waitingfor - Get pending input request for player */
  router.get('/:id/waitingfor', (req: Request, res: Response) => {
    try {
      const playerId = req.params.id as PlayerId;
      const resolved = resolveGameForPlayer(req, playerId);
      if (!resolved) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }

      const { game } = resolved;
      const deviceId = req.query.deviceId as string | undefined;
      if (!game.isSeatClaimedByDevice(playerId, deviceId)) {
        res.status(403).json({ error: 'This device is not assigned to that player' });
        return;
      }

      const waitingFor = game.getWaitingForPlayer?.(playerId) ?? null;
      res.json(waitingFor);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  /** POST /api/player/:id/input - Submit player input */
  router.post('/:id/input', (req: Request, res: Response) => {
    try {
      const playerId = req.params.id as PlayerId;
      const resolved = resolveGameForPlayer(req, playerId);
      if (!resolved) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }

      const { game } = resolved;
      const deviceId = req.query.deviceId as string | undefined;
      if (!game.isSeatClaimedByDevice(playerId, deviceId)) {
        res.status(403).json({ error: 'This device is not assigned to that player' });
        return;
      }

      const input = req.body;
      const waitingFor = game.getWaitingForPlayer?.(playerId) ?? null;

      if (!waitingFor) {
        res.status(400).json({ error: 'No input expected' });
        return;
      }

      // Handle cancel/back
      if (input.cancel) {
        if (!game.canCancelCurrentInput()) {
          res.status(400).json({ error: 'Cannot cancel this input step.' });
          return;
        }
        if (input.cancelType === 'habitat') {
          game.handleCancelHabitat(playerId);
        } else {
          game.handleCancelAction(playerId);
        }
        saveGame(game, db);
        res.json(buildViewerGameView(game, req));
        return;
      }

      // Route input based on the current waitingFor type
      routeInput(game, playerId, waitingFor.type, input);

      // Save game state after processing
      saveGame(game, db);

      res.json(buildViewerGameView(game, req));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

/**
 * Route the player's input to the appropriate game handler based on the current input type.
 */
function routeInput(
  game: any,
  playerId: PlayerId,
  inputType: InputType,
  input: any
): void {
  const hasDeferredAction = !!game.deferredActions?.getCurrentAction?.();

  switch (inputType) {
    case InputType.SELECT_BIRD_TO_KEEP:
      // input: { selectedBirds: BirdCardName[] }
      game.handleSetupChoice(playerId, input.selectedBirds || []);
      break;

    case InputType.SELECT_BONUS_CARD:
      // input: { selectedBonusCards: BonusCardName[] }
      if (hasDeferredAction) {
        game.handleDeferredInput(playerId, input);
      } else {
        game.handleBonusCardChoice(playerId, input.selectedBonusCards || []);
      }
      break;

    case InputType.SELECT_STARTING_FOOD:
      // input: { selectedFood: FoodType[] }
      game.handleStartingFoodChoice(playerId, input.selectedFood || []);
      break;

    case InputType.SELECT_ACTION:
      // input: { selectedAction: ActionType }
      game.handleActionChoice(playerId, input.selectedAction || input.action);
      break;

    case InputType.SELECT_BIRD:
      // input: { selectedBirds: BirdCardName[] }
      if (hasDeferredAction) {
        game.handleDeferredInput(playerId, input);
      } else {
        game.handleBirdSelection(playerId, (input.selectedBirds || [])[0]);
      }
      break;

    case InputType.SELECT_HABITAT_SLOT:
      // input: { selectedHabitat: HabitatType }
      if (hasDeferredAction) {
        game.handleDeferredInput(playerId, input);
      } else {
        game.handleHabitatSelection(playerId, input.selectedHabitat || input.habitat);
      }
      break;

    default:
      // For all other inputs (deferred actions), pass through
      game.handleDeferredInput(playerId, input);
      break;
  }
}
