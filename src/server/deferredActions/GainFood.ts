import { DeferredAction, ActionPriority } from './DeferredAction';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import { InputType } from '../../common/input/InputType';
import { FoodType } from '../../common/game/FoodType';
import { GameEvent } from '../powers/PowerEventBus';

/**
 * Gain food from the birdfeeder.
 * Player selects which food to take from available dice.
 */
export class GainFood extends DeferredAction {
  private readonly count: number;
  private readonly allowedFoods?: Set<FoodType>;
  private readonly message?: string;
  private gained: number = 0;
  private rerolled: boolean = false;

  constructor(
    player: Player,
    count: number,
    options?: {
      allowedFoods?: ReadonlyArray<FoodType>;
      message?: string;
    },
  ) {
    super(player, ActionPriority.GAIN);
    this.count = count;
    this.allowedFoods = options?.allowedFoods ? new Set(options.allowedFoods) : undefined;
    this.message = options?.message;
  }

  execute(game: Game): PlayerInputModel | undefined {
    return this.askForFood(game);
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const input = response as any;

    // Optional reroll action (allowed only while taking food and only if rule permits).
    if (input.rerollBirdfeeder === true) {
      if (game.birdfeeder.canRerollByRule()) {
        this.rerolled = true;
        game.birdfeeder.rollAll();
      }
      return this.askForFood(game);
    }

    // Client sends { selectedFood: [FoodType] } or a raw FoodType
    const selectedFood: FoodType = Array.isArray(input.selectedFood)
      ? input.selectedFood[0]
      : (input.selectedFood || input);
    if (this.allowedFoods && !this.allowedFoods.has(selectedFood)) {
      return this.askForFood(game);
    }
    const taken = game.birdfeeder.takeFood(selectedFood);
    if (taken !== null) {
      this.player.addFood(taken);
      this.gained++;
      game.fireGameEvent(GameEvent.FOOD_GAINED, this.player);
    }
    if (this.gained >= this.count) {
      return undefined;
    }
    return this.askForFood(game);
  }

  private askForFood(game: Game): PlayerInputModel | undefined {
    const availableDice = game.birdfeeder.getAvailableDice()
      .map(d => ({ foods: d.face.foods.filter(f => !this.allowedFoods || this.allowedFoods.has(f)) }))
      .filter(d => d.foods.length > 0);
    if (availableDice.length === 0 || this.gained >= this.count) {
      return undefined;
    }
    return {
      type: InputType.SELECT_FOOD,
      availableDice,
      canReroll: game.birdfeeder.canRerollByRule(),
      lockBack: this.rerolled,
      min: 1,
      max: 1,
      message: this.message,
    };
  }

  isCancellationLocked(): boolean {
    return this.rerolled || this.gained > 0;
  }
}
