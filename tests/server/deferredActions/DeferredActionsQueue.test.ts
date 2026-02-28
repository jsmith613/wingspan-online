import { DeferredAction, ActionPriority } from '../../../src/server/deferredActions/DeferredAction';
import { DeferredActionsQueue } from '../../../src/server/deferredActions/DeferredActionsQueue';
import { Player } from '../../../src/server/Player';
import { Game } from '../../../src/server/Game';
import { PlayerId, GameId } from '../../../src/common/Types';
import { PlayerInputModel } from '../../../src/common/input/PlayerInputModel';

// Concrete test action that completes immediately
class ImmediateAction extends DeferredAction {
  public executed = false;
  constructor(player: Player, priority: ActionPriority = ActionPriority.DEFAULT) {
    super(player, priority);
  }
  execute(_game: Game): PlayerInputModel | undefined {
    this.executed = true;
    return undefined;
  }
}

// Test action that requires input
class InputAction extends DeferredAction {
  public executed = false;
  public inputHandled = false;
  private readonly inputRequest: PlayerInputModel;

  constructor(player: Player, inputRequest: PlayerInputModel, priority: ActionPriority = ActionPriority.DEFAULT) {
    super(player, priority);
    this.inputRequest = inputRequest;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    this.executed = true;
    return this.inputRequest;
  }

  handleInput(_game: Game, _response: unknown): PlayerInputModel | undefined {
    this.inputHandled = true;
    return undefined;
  }
}

describe('DeferredActionsQueue', () => {
  let queue: DeferredActionsQueue;
  let player: Player;
  let game: Game;

  beforeEach(() => {
    queue = new DeferredActionsQueue();
    player = new Player('test_player' as PlayerId, 'Test', 8);
    game = new Game('test_game' as GameId, ['A', 'B'], 42);
  });

  describe('push and ordering', () => {
    it('should maintain priority order', () => {
      const low = new ImmediateAction(player, ActionPriority.PINK_POWER);
      const high = new ImmediateAction(player, ActionPriority.COST);
      const mid = new ImmediateAction(player, ActionPriority.DEFAULT);

      queue.push(low);
      queue.push(high);
      queue.push(mid);

      // Process in priority order: COST first
      queue.processNext(game);
      expect(high.executed).toBe(true);
      expect(mid.executed).toBe(false);
      expect(low.executed).toBe(false);

      queue.processNext(game);
      expect(mid.executed).toBe(true);

      queue.processNext(game);
      expect(low.executed).toBe(true);
    });
  });

  describe('processing', () => {
    it('should report hasPending correctly', () => {
      expect(queue.hasPending).toBe(false);
      queue.push(new ImmediateAction(player));
      expect(queue.hasPending).toBe(true);
      queue.processNext(game);
      expect(queue.hasPending).toBe(false);
    });

    it('should handle actions that need input', () => {
      const inputReq = {
        type: 'SELECT_OPTION' as any,
        options: ['a', 'b'],
        message: 'Choose',
      };
      const action = new InputAction(player, inputReq);
      queue.push(action);

      const result = queue.processNext(game);
      expect(result).toBeDefined();
      expect(action.executed).toBe(true);
      expect(queue.hasPending).toBe(true); // waiting for input

      const afterInput = queue.handleInput(game, 'a');
      expect(afterInput).toBeUndefined();
      expect(action.inputHandled).toBe(true);
      expect(queue.hasPending).toBe(false);
    });
  });

  describe('runUntilInput', () => {
    it('should run all immediate actions', () => {
      const a1 = new ImmediateAction(player);
      const a2 = new ImmediateAction(player);
      queue.push(a1);
      queue.push(a2);

      const result = queue.runUntilInput(game);
      expect(result).toBeUndefined();
      expect(a1.executed).toBe(true);
      expect(a2.executed).toBe(true);
    });

    it('should stop at first action requiring input', () => {
      const a1 = new ImmediateAction(player, ActionPriority.COST);
      const inputReq = {
        type: 'SELECT_OPTION' as any,
        options: ['x'],
        message: 'Pick',
      };
      const a2 = new InputAction(player, inputReq, ActionPriority.DEFAULT);
      const a3 = new ImmediateAction(player, ActionPriority.PINK_POWER);

      queue.push(a1);
      queue.push(a2);
      queue.push(a3);

      const result = queue.runUntilInput(game);
      expect(result).toBeDefined();
      expect(a1.executed).toBe(true);
      expect(a2.executed).toBe(true);
      expect(a3.executed).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all pending actions', () => {
      queue.push(new ImmediateAction(player));
      queue.push(new ImmediateAction(player));
      queue.clear();
      expect(queue.hasPending).toBe(false);
      expect(queue.length).toBe(0);
    });
  });
});
