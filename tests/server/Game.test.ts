import { Game } from '../../src/server/Game';
import { GameSetup } from '../../src/server/GameSetup';
import { Phase } from '../../src/common/game/Phase';
import { InputType } from '../../src/common/input/InputType';
import { ActionType } from '../../src/common/game/ActionType';
import { ACTION_CUBES_PER_ROUND, MAX_ROUNDS } from '../../src/common/constants';
import { GameId, PlayerId } from '../../src/common/Types';
import { createTestGame, createStartedGame } from './helpers/TestGame';

describe('Game', () => {
  describe('creation', () => {
    it('should create a game with the correct number of players', () => {
      const game = createTestGame(['Alice', 'Bob']);
      expect(game.players).toHaveLength(2);
      expect(game.players[0].name).toBe('Alice');
      expect(game.players[1].name).toBe('Bob');
    });

    it('should start in SETUP phase', () => {
      const game = createTestGame();
      expect(game.phase).toBe(Phase.SETUP);
    });

    it('should start at round 0', () => {
      const game = createTestGame();
      expect(game.round).toBe(0);
    });
  });

  describe('setup', () => {
    it('should deal 5 birds and 5 food to each player on startGame', () => {
      const game = createTestGame();
      game.startGame();
      for (const player of game.players) {
        expect(player.hand).toHaveLength(5);
        expect(player.food).toHaveLength(5);
      }
    });

    it('should deal 2 bonus cards to each player', () => {
      const game = createTestGame();
      game.startGame();
      for (const player of game.players) {
        expect(player.bonusCards).toHaveLength(2);
      }
    });

    it('should return SELECT_BIRD_TO_KEEP input for first player', () => {
      const game = createTestGame();
      const input = game.startGame();
      expect(input).toBeDefined();
      expect(input!.type).toBe(InputType.SELECT_BIRD_TO_KEEP);
    });

    it('should fill the bird tray on start', () => {
      const game = createTestGame();
      game.startGame();
      expect(game.getBirdTray()).toHaveLength(3);
    });
  });

  describe('round management', () => {
    it('should start round 1 after setup', () => {
      const game = createStartedGame();
      expect(game.round).toBe(1);
      expect(game.phase).toBe(Phase.PLAYER_TURN);
    });

    it('should give correct action cubes per round', () => {
      const game = createStartedGame();
      expect(game.players[0].actionCubes).toBe(ACTION_CUBES_PER_ROUND[0]);
    });
  });

  describe('turn cycling', () => {
    it('should prompt the current player for an action', () => {
      const game = createStartedGame();
      const viewModel = game.toViewModel();
      expect(viewModel.waitingFor).toBeDefined();
      expect(viewModel.waitingFor!.type).toBe(InputType.SELECT_ACTION);
    });
  });

  describe('serialization', () => {
    it('should serialize and deserialize a game', () => {
      const game = createTestGame(['Alice', 'Bob'], 42);
      game.startGame();
      const serialized = game.serialize();
      const restored = Game.deserialize(serialized);

      expect(restored.id).toBe(game.id);
      expect(restored.phase).toBe(game.phase);
      expect(restored.round).toBe(game.round);
      expect(restored.players).toHaveLength(game.players.length);
      expect(restored.players[0].name).toBe('Alice');
      expect(restored.players[1].name).toBe('Bob');
    });

    it('should preserve player state through serialization', () => {
      const game = createTestGame(['Alice', 'Bob'], 42);
      game.startGame();
      const serialized = game.serialize();
      const restored = Game.deserialize(serialized);

      for (let i = 0; i < game.players.length; i++) {
        expect(restored.players[i].hand).toEqual(game.players[i].hand);
        expect(restored.players[i].food).toEqual(game.players[i].food);
        expect(restored.players[i].bonusCards).toEqual(game.players[i].bonusCards);
      }
    });
  });

  describe('view model', () => {
    it('should produce a valid view model', () => {
      const game = createTestGame();
      game.startGame();
      const vm = game.toViewModel();
      expect(vm.id).toBe(game.id);
      expect(vm.phase).toBe(Phase.SETUP);
      expect(vm.players).toHaveLength(2);
      expect(vm.birdfeeder.availableFood.length).toBeGreaterThan(0);
      expect(vm.birdTray.faceUpCards).toHaveLength(3);
    });
  });

  describe('GameSetup', () => {
    it('should reject fewer than MIN_PLAYERS', () => {
      expect(() => {
        GameSetup.createGame('test' as GameId, ['Solo']);
      }).toThrow('at least');
    });

    it('should reject more than MAX_PLAYERS', () => {
      expect(() => {
        GameSetup.createGame('test' as GameId, ['A', 'B', 'C', 'D', 'E', 'F']);
      }).toThrow('Maximum');
    });

    it('should generate unique game IDs', () => {
      const id1 = GameSetup.generateGameId();
      const id2 = GameSetup.generateGameId();
      expect(id1).not.toBe(id2);
    });
  });
});
