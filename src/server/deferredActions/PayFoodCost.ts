import { DeferredAction, ActionPriority } from './DeferredAction';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import { InputType } from '../../common/input/InputType';
import { FoodType } from '../../common/game/FoodType';
import { FoodCost } from '../../common/Units';

/**
 * Pay a food cost. Handles wild food (player chooses which type to pay).
 */
export class PayFoodCost extends DeferredAction {
  private readonly cost: FoodCost;
  private remaining: FoodType[];
  private wildRemaining: number;

  constructor(player: Player, cost: FoodCost) {
    super(player, ActionPriority.COST);
    this.cost = cost;
    // Separate specific foods from wild
    this.remaining = cost.foods.filter(f => f !== FoodType.WILD);
    this.wildRemaining = cost.wildCount;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    return this.payNext();
  }

  handleInput(_game: Game, response: unknown): PlayerInputModel | undefined {
    const input = response as any;
    const foodType: FoodType = Array.isArray(input.selectedFood)
      ? input.selectedFood[0]
      : (input.selectedFood || input);
    const idx = this.player.food.indexOf(foodType);
    if (idx !== -1) {
      this.player.food.splice(idx, 1);
      if (this.wildRemaining > 0) {
        this.wildRemaining--;
      }
    }
    return this.payNext();
  }

  private payNext(): PlayerInputModel | undefined {
    // First pay specific food costs
    while (this.remaining.length > 0) {
      const needed = this.remaining[0];
      const idx = this.player.food.indexOf(needed);
      if (idx !== -1) {
        this.player.food.splice(idx, 1);
        this.remaining.shift();
      } else {
        // Can't pay — this shouldn't happen if validation passed
        this.remaining.shift();
      }
    }

    // Then handle wild costs — player chooses
    if (this.wildRemaining > 0) {
      const playerFood = this.player.food.filter(f => f !== FoodType.WILD);
      if (playerFood.length === 0) {
        return undefined;
      }
      return {
        type: InputType.SELECT_FOOD,
        availableDice: playerFood.map(f => ({ foods: [f] })),
        min: 1,
        max: 1,
      };
    }

    return undefined;
  }
}
