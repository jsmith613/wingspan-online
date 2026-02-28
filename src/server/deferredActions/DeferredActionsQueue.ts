import { DeferredAction } from './DeferredAction';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';

/**
 * Priority queue for deferred actions.
 * Actions are processed in priority order (lowest number = highest priority).
 * When an action requires player input, processing pauses until the input is provided.
 */
export class DeferredActionsQueue {
  private queue: DeferredAction[] = [];
  private currentAction: DeferredAction | null = null;

  /** Add an action to the queue, maintaining priority order. */
  push(action: DeferredAction): void {
    this.queue.push(action);
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  /** Add multiple actions. */
  pushAll(actions: DeferredAction[]): void {
    for (const action of actions) {
      this.push(action);
    }
  }

  /** Check if there are pending actions. */
  get hasPending(): boolean {
    return this.queue.length > 0 || this.currentAction !== null;
  }

  /** Get the number of pending actions. */
  get length(): number {
    return this.queue.length + (this.currentAction ? 1 : 0);
  }

  /**
   * Process the next action in the queue.
   * Returns a PlayerInputModel if the action needs player input, or undefined if
   * the action completed (caller should call again to process next).
   */
  processNext(game: Game): PlayerInputModel | undefined {
    if (this.currentAction) {
      // There's an action waiting for input — shouldn't call processNext
      return undefined;
    }
    if (this.queue.length === 0) {
      return undefined;
    }

    this.currentAction = this.queue.shift()!;
    const result = this.currentAction.execute(game);

    if (result !== undefined) {
      // Action needs player input — keep it as current
      return result;
    }

    // Action completed without needing input
    this.currentAction = null;
    return undefined;
  }

  /**
   * Provide input to the currently waiting action.
   * Returns a PlayerInputModel if the action needs more input,
   * or undefined if it's done.
   */
  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    if (!this.currentAction) {
      throw new Error('No action waiting for input');
    }

    if (!this.currentAction.handleInput) {
      // Action doesn't handle input — it's done
      this.currentAction = null;
      return undefined;
    }

    const result = this.currentAction.handleInput(game, response);

    if (result !== undefined) {
      return result;
    }

    this.currentAction = null;
    return undefined;
  }

  /**
   * Run the queue until it needs player input or is empty.
   * Returns a PlayerInputModel if input is needed, or undefined if all actions are done.
   */
  runUntilInput(game: Game): PlayerInputModel | undefined {
    while (this.queue.length > 0 && !this.currentAction) {
      const result = this.processNext(game);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  /** Clear the queue. */
  clear(): void {
    this.queue = [];
    this.currentAction = null;
  }

  /** Get the current action waiting for input. */
  getCurrentAction(): DeferredAction | null {
    return this.currentAction;
  }
}
