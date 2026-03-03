import { FoodType } from '../../common/game/FoodType';
import { InputType } from '../../common/input/InputType';
import type { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { Player } from '../Player';
import { ActionPriority, DeferredAction } from './DeferredAction';

const CONFIRM_TRADE_ONE_FOOD = 'CONFIRM_TRADE_ONE_FOOD';
const SKIP_TRADE_ONE_FOOD = 'SKIP_TRADE_ONE_FOOD';

type Phase = 'choose' | 'pay' | 'gain';

export class TradeOneFoodForAnyFood extends DeferredAction {
  private readonly message: string;
  private phase: Phase = 'choose';
  private paid = false;

  constructor(player: Player, message: string) {
    super(player, ActionPriority.DEFAULT);
    this.message = message;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    const canConfirm = this.player.food.length > 0;
    return {
      type: InputType.SELECT_OPTION,
      options: [CONFIRM_TRADE_ONE_FOOD, SKIP_TRADE_ONE_FOOD],
      disabledOptions: canConfirm ? [] : [CONFIRM_TRADE_ONE_FOOD],
      message: canConfirm ? this.message : `${this.message} (No food to trade)`,
    };
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    if (this.phase === 'choose') {
      const selected = (response as any)?.selectedOption as string | undefined;
      if (selected === SKIP_TRADE_ONE_FOOD) return undefined;
      if (selected !== CONFIRM_TRADE_ONE_FOOD || this.player.food.length === 0) {
        return this.execute(game);
      }
      this.phase = 'pay';
      return this.askPayFood();
    }

    if (this.phase === 'pay') {
      const selectedFood = (response as any)?.selectedOption as FoodType | undefined;
      if (!selectedFood) return this.askPayFood();
      const idx = this.player.food.indexOf(selectedFood);
      if (idx === -1) return this.askPayFood();
      this.player.food.splice(idx, 1);
      this.paid = true;
      this.phase = 'gain';
      return this.askGainFood();
    }

    const gainFood = (response as any)?.selectedOption as FoodType | undefined;
    if (!gainFood || gainFood === FoodType.WILD) return this.askGainFood();
    if (!this.paid) return undefined;
    this.player.addFood(gainFood);
    return undefined;
  }

  private askPayFood(): PlayerInputModel {
    return {
      type: InputType.SELECT_OPTION,
      options: [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.FISH, FoodType.FRUIT, FoodType.RODENT]
        .filter((f) => this.player.food.includes(f)),
      message: 'Choose 1 food to trade away.',
    };
  }

  private askGainFood(): PlayerInputModel {
    return {
      type: InputType.SELECT_OPTION,
      options: [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.FISH, FoodType.FRUIT, FoodType.RODENT],
      message: 'Choose 1 food to gain.',
    };
  }
}

