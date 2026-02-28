import type { Player } from '../Player';
import type { Game } from '../Game';
import { BirdCard } from '../cards/BirdCard';
import { ActionPriority, DeferredAction } from '../deferredActions/DeferredAction';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';

/**
 * Events that can trigger pink powers.
 */
export enum GameEvent {
  BIRD_PLAYED = 'BIRD_PLAYED',
  FOOD_GAINED = 'FOOD_GAINED',
  EGG_LAID = 'EGG_LAID',
  CARD_DRAWN = 'CARD_DRAWN',
  CARD_TUCKED = 'CARD_TUCKED',
  FOOD_CACHED = 'FOOD_CACHED',
}

interface RegisteredPower {
  bird: BirdCard;
  owner: Player;
}

/**
 * Fires game events and activates relevant pink powers.
 * Pink powers trigger "once between turns" for their owner.
 */
export class PowerEventBus {
  private listeners: Map<GameEvent, RegisteredPower[]> = new Map();

  /** Register a bird's pink power for a game event. */
  register(event: GameEvent, bird: BirdCard, owner: Player): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push({ bird, owner });
  }

  /** Unregister all powers for a specific bird. */
  unregister(bird: BirdCard): void {
    for (const [event, powers] of this.listeners) {
      this.listeners.set(event, powers.filter(p => p.bird !== bird));
    }
  }

  /**
   * Fire an event. Creates deferred actions for all triggered pink powers.
   * Pink powers activate at PINK_POWER priority.
   */
  fireEvent(event: GameEvent, triggeringPlayer: Player, game: Game): void {
    const powers = this.listeners.get(event);
    if (!powers) return;

    for (const { bird, owner } of powers) {
      const triggered = bird.onTrigger(event, triggeringPlayer, owner, game);
      if (triggered) {
        // The onTrigger method should push its own deferred actions
      }
    }
  }

  /** Clear all registered listeners. */
  clear(): void {
    this.listeners.clear();
  }
}
