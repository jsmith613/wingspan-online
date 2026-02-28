import { BirdCardName } from '../../common/cards/BirdCardName';
import { FoodType } from '../../common/game/FoodType';
import { NestType } from '../../common/game/NestType';
import { HabitatType } from '../../common/game/HabitatType';
import { PowerType } from '../../common/game/PowerType';
import { ClientBirdCard } from '../../common/cards/ClientBirdCard';
import { PlacedBird } from '../habitats/PlayerBoard';
import type { Player } from '../Player';
import type { Game } from '../Game';
import type { GameEvent } from '../powers/PowerEventBus';

export interface BirdCardProperties {
  readonly name: BirdCardName;
  readonly commonName: string;
  readonly scientificName: string;
  readonly habitats: ReadonlyArray<HabitatType>;
  readonly foodCost: ReadonlyArray<FoodType>;
  readonly nestType: NestType;
  readonly eggCapacity: number;
  readonly wingspan: number;
  readonly points: number;
  readonly powerType: PowerType;
  readonly powerText: string;
}

/**
 * Base class for all bird cards.
 * Provides property caching, default no-op power methods, and serialization.
 */
export abstract class BirdCard implements BirdCardProperties {
  public abstract readonly name: BirdCardName;
  public abstract readonly commonName: string;
  public abstract readonly scientificName: string;
  public abstract readonly habitats: ReadonlyArray<HabitatType>;
  public abstract readonly foodCost: ReadonlyArray<FoodType>;
  public abstract readonly nestType: NestType;
  public abstract readonly eggCapacity: number;
  public abstract readonly wingspan: number;
  public abstract readonly points: number;
  public abstract readonly powerType: PowerType;
  public abstract readonly powerText: string;

  // Mutable state when placed on board
  public eggs: number = 0;
  public cachedFood: number = 0;
  public tuckedCards: number = 0;

  // Property caching
  private _totalFoodCost: number | undefined;
  private _habitatSet: Set<HabitatType> | undefined;

  /** Total food cost (number of food tokens required). */
  get totalFoodCost(): number {
    if (this._totalFoodCost === undefined) {
      this._totalFoodCost = this.foodCost.length;
    }
    return this._totalFoodCost;
  }

  /** Set of habitats for O(1) lookup. */
  get habitatSet(): Set<HabitatType> {
    if (this._habitatSet === undefined) {
      this._habitatSet = new Set(this.habitats);
    }
    return this._habitatSet;
  }

  /** Check if this bird can live in a given habitat. */
  canLiveIn(habitat: HabitatType): boolean {
    return this.habitatSet.has(habitat);
  }

  // =========================================================================
  // Power Methods (default no-ops, overridden by specific cards)
  // =========================================================================

  /**
   * Brown power: activated when the habitat action passes through this bird.
   * Override in brown-power bird cards.
   */
  onActivate(_player: Player, _game: Game): void {
    // no-op
  }

  /**
   * Pink power: triggered by game events between turns.
   * Override in pink-power bird cards.
   * Returns true if the power was triggered.
   */
  onTrigger(_event: GameEvent, _triggeringPlayer: Player, _owner: Player, _game: Game): boolean {
    return false;
  }

  /**
   * White power: one-time effect when the bird is played.
   * Override in white-power bird cards.
   */
  onPlay(_player: Player, _game: Game): void {
    // no-op
  }

  /**
   * Game-end scoring power: extra points at end of game.
   * Override in game-end bird cards.
   */
  getGameEndPoints(_player: Player): number {
    return 0;
  }

  /**
   * Which game events this bird responds to (for pink powers).
   * Override in pink-power bird cards.
   */
  getTriggeredEvents(): GameEvent[] {
    return [];
  }

  // =========================================================================
  // Serialization & View
  // =========================================================================

  /** Create a PlacedBird for the player board. */
  toPlacedBird(): PlacedBird {
    return {
      name: this.name,
      eggs: this.eggs,
      cachedFood: this.cachedFood,
      tuckedCards: this.tuckedCards,
    };
  }

  /** Convert to client view model. */
  toClientCard(): ClientBirdCard {
    return {
      name: this.name,
      commonName: this.commonName,
      scientificName: this.scientificName,
      habitats: this.habitats,
      foodCost: this.foodCost,
      nestType: this.nestType,
      eggCapacity: this.eggCapacity,
      wingspan: this.wingspan,
      points: this.points,
      powerType: this.powerType,
      powerText: this.powerText,
      eggs: this.eggs,
      cachedFood: this.cachedFood,
      tuckedCards: this.tuckedCards,
    };
  }

  /** Apply mutable state from serialized data. */
  applyState(eggs: number, cachedFood: number, tuckedCards: number): void {
    this.eggs = eggs;
    this.cachedFood = cachedFood;
    this.tuckedCards = tuckedCards;
  }
}
