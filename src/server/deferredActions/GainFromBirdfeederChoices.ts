import { FoodType } from '../../common/game/FoodType';
import { InputType } from '../../common/input/InputType';
import type { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { Player } from '../Player';
import { ActionPriority, DeferredAction } from './DeferredAction';

const CONFIRM_GAIN_BIRDFEEDER = 'CONFIRM_GAIN_BIRDFEEDER';
const SKIP_GAIN_BIRDFEEDER = 'SKIP_GAIN_BIRDFEEDER';

type Phase = 'choose' | 'pickFood';

export class GainFromBirdfeederChoices extends DeferredAction {
  private readonly allowedFoods: FoodType[];
  private readonly message: string;
  private phase: Phase = 'choose';

  constructor(player: Player, allowedFoods: ReadonlyArray<FoodType>, message: string) {
    super(player, ActionPriority.DEFAULT);
    this.allowedFoods = [...allowedFoods];
    this.message = message;
  }

  execute(game: Game): PlayerInputModel | undefined {
    const canConfirm = this.getAvailableDice(game).length > 0;
    return {
      type: InputType.SELECT_OPTION,
      options: [CONFIRM_GAIN_BIRDFEEDER, SKIP_GAIN_BIRDFEEDER],
      disabledOptions: canConfirm ? [] : [CONFIRM_GAIN_BIRDFEEDER],
      message: canConfirm ? this.message : `${this.message} (No valid food in birdfeeder)`,
    };
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    if (this.phase === 'choose') {
      const selected = (response as any)?.selectedOption as string | undefined;
      if (selected === SKIP_GAIN_BIRDFEEDER) return undefined;
      if (selected !== CONFIRM_GAIN_BIRDFEEDER) return this.execute(game);
      const availableDice = this.getAvailableDice(game);
      if (availableDice.length === 0) return this.execute(game);
      this.phase = 'pickFood';
      return {
        type: InputType.SELECT_FOOD,
        availableDice,
        min: 1,
        max: 1,
        message: this.message,
      };
    }

    const selectedFood = Array.isArray((response as any)?.selectedFood)
      ? (response as any).selectedFood[0] as FoodType | undefined
      : (response as any)?.selectedFood as FoodType | undefined;
    if (!selectedFood || !this.allowedFoods.includes(selectedFood)) {
      return {
        type: InputType.SELECT_FOOD,
        availableDice: this.getAvailableDice(game),
        min: 1,
        max: 1,
        message: this.message,
      };
    }

    const taken = game.birdfeeder.takeFood(selectedFood);
    if (taken) {
      this.player.addFood(taken);
      return undefined;
    }
    return {
      type: InputType.SELECT_FOOD,
      availableDice: this.getAvailableDice(game),
      min: 1,
      max: 1,
      message: this.message,
    };
  }

  private getAvailableDice(game: Game) {
    return game.birdfeeder.getAvailableDice()
      .map((d) => ({
        foods: d.face.foods.filter((f) => this.allowedFoods.includes(f)),
      }))
      .filter((d) => d.foods.length > 0);
  }
}
