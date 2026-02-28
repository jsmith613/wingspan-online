import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';

export enum ActionPriority {
  COST = 1,
  DISCARD = 2,
  DEFAULT = 3,
  GAIN = 4,
  DRAW = 5,
  PINK_POWER = 10,
}

/**
 * Abstract base class for all deferred actions.
 * Deferred actions represent multi-step operations that may require player input.
 */
export abstract class DeferredAction {
  public readonly priority: ActionPriority;
  public readonly player: Player;

  constructor(player: Player, priority: ActionPriority = ActionPriority.DEFAULT) {
    this.player = player;
    this.priority = priority;
  }

  /**
   * Execute this action. Returns a PlayerInputModel if player input is needed,
   * or null/undefined if the action completed without input.
   */
  abstract execute(game: Game): PlayerInputModel | undefined;

  /**
   * Process the player's response to an input request.
   * Called when this action previously returned a PlayerInputModel and the player responded.
   * Returns another PlayerInputModel if more input is needed, or undefined if done.
   */
  handleInput?(game: Game, response: unknown): PlayerInputModel | undefined;

  /**
   * Whether the player is locked into the current top-level action and may not cancel/back out.
   */
  isCancellationLocked(): boolean {
    return false;
  }
}
