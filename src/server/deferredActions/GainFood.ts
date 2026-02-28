import { DeferredAction, ActionPriority } from './DeferredAction';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import { InputType } from '../../common/input/InputType';
import { FoodType } from '../../common/game/FoodType';

/**
 * Gain food from the birdfeeder.
 * Player selects which food to take from available dice.
 */
export class GainFood extends DeferredAction {
  private readonly count: number;
  private gained: number = 0;

  constructor(player: Player, count: number) {
    super(player, ActionPriority.GAIN);
    this.count = count;
  }

  execute(game: Game): PlayerInputModel | undefined {
    return this.askForFood(game);
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    // Client sends { selectedFood: [FoodType] } or a raw FoodType
    const input = response as any;
    const selectedFood: FoodType = Array.isArray(input.selectedFood)
      ? input.selectedFood[0]
      : (input.selectedFood || input);
    const taken = game.birdfeeder.takeFood(selectedFood);
    if (taken !== null) {
      this.player.addFood(taken);
      this.gained++;
    }
    if (this.gained >= this.count) {
      return undefined;
    }
    return this.askForFood(game);
  }

  private askForFood(game: Game): PlayerInputModel | undefined {
    const availableDice = game.birdfeeder.getAvailableDice();
    if (availableDice.length === 0 || this.gained >= this.count) {
      return undefined;
    }
    return {
      type: InputType.SELECT_FOOD,
      availableDice: availableDice.map(d => ({ foods: [...d.face.foods] })),
      min: 1,
      max: 1,
    };
  }
}
