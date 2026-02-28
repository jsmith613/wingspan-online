import { DeferredAction, ActionPriority } from './DeferredAction';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import { InputType } from '../../common/input/InputType';
import { FoodType } from '../../common/game/FoodType';
import { PlacedBird } from '../habitats/PlayerBoard';

/**
 * Cache food from the player's supply onto a bird.
 */
export class CacheFood extends DeferredAction {
  private readonly targetBird: PlacedBird;
  private readonly count: number;

  constructor(player: Player, targetBird: PlacedBird, count: number = 1) {
    super(player, ActionPriority.DEFAULT);
    this.targetBird = targetBird;
    this.count = count;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    if (this.player.food.length === 0) {
      return undefined;
    }
    return this.askForFoodToCache();
  }

  handleInput(_game: Game, response: unknown): PlayerInputModel | undefined {
    const input = response as any;
    const selectedFood: FoodType = Array.isArray(input.selectedFood)
      ? input.selectedFood[0]
      : (input.selectedFood || input);
    const idx = this.player.food.indexOf(selectedFood);
    if (idx !== -1) {
      this.player.food.splice(idx, 1);
      this.targetBird.cachedFood++;
    }
    return undefined;
  }

  private askForFoodToCache(): PlayerInputModel | undefined {
    if (this.player.food.length === 0) {
      return undefined;
    }
    // Present each food in the player's supply as a single-food "die"
    return {
      type: InputType.SELECT_FOOD,
      availableDice: this.player.food.map(f => ({ foods: [f] })),
      min: 1,
      max: Math.min(this.count, this.player.food.length),
    };
  }
}
