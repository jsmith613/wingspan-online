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

  /** GET /api/player/:id/waitingfor - Get pending input request for player */
  router.get('/:id/waitingfor', (req: Request, res: Response) => {
    try {
      const playerId = req.params.id as PlayerId;
      const gameId = playerGameMap.get(playerId);
      if (!gameId) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }

      const game = getGame(gameId, db);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      const vm = game.toViewModel();
      // Return waitingFor only to the player whose input is currently expected.
      const expectedPlayerId = game.getExpectedInputPlayerId();
      if (vm.waitingFor && expectedPlayerId === playerId) {
        res.json(vm.waitingFor);
      } else {
        res.json(null);
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  /** POST /api/player/:id/input - Submit player input */
  router.post('/:id/input', (req: Request, res: Response) => {
    try {
      const playerId = req.params.id as PlayerId;
      const gameId = playerGameMap.get(playerId);
      if (!gameId) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }

      const game = getGame(gameId, db);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      const input = req.body;
      const vm = game.toViewModel();
      const waitingFor = vm.waitingFor;

      if (!waitingFor) {
        res.status(400).json({ error: 'No input expected' });
        return;
      }

      const expectedPlayerId = game.getExpectedInputPlayerId();
      if (expectedPlayerId !== playerId) {
        res.status(400).json({ error: 'Not waiting for this player input' });
        return;
      }

      // Handle cancel/back
      if (input.cancel) {
        if (!game.canCancelCurrentInput()) {
          res.status(400).json({ error: 'Cannot cancel after rerolling birdfeeder during Gain Food.' });
          return;
        }
        if (input.cancelType === 'habitat') {
          game.handleCancelHabitat(playerId);
        } else {
          game.handleCancelAction(playerId);
        }
        saveGame(game, db);
        res.json(game.toViewModel());
        return;
      }

      // Route input based on the current waitingFor type
      routeInput(game, playerId, waitingFor.type, input);

      // Save game state after processing
      saveGame(game, db);

      res.json(game.toViewModel());
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
  switch (inputType) {
    case InputType.SELECT_BIRD_TO_KEEP:
      // input: { selectedBirds: BirdCardName[] }
      game.handleSetupChoice(playerId, input.selectedBirds || []);
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
      game.handleBirdSelection(playerId, (input.selectedBirds || [])[0]);
      break;

    case InputType.SELECT_HABITAT_SLOT:
      // input: { selectedHabitat: HabitatType }
      game.handleHabitatSelection(playerId, input.selectedHabitat || input.habitat);
      break;

    default:
      // For all other inputs (deferred actions), pass through
      game.handleDeferredInput(playerId, input);
      break;
  }
}
