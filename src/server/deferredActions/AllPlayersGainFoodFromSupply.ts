import { FoodType } from '../../common/game/FoodType';
import { InputType } from '../../common/input/InputType';
import type { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { Player } from '../Player';
import { ActionPriority, DeferredAction } from './DeferredAction';

const CONFIRM_ALL_PLAYERS_GAIN = 'CONFIRM_ALL_PLAYERS_GAIN';
const SKIP_ALL_PLAYERS_GAIN = 'SKIP_ALL_PLAYERS_GAIN';

export class AllPlayersGainFoodFromSupply extends DeferredAction {
  private readonly food: FoodType;
  private readonly message: string;

  constructor(player: Player, food: FoodType, message: string) {
    super(player, ActionPriority.DEFAULT);
    this.food = food;
    this.message = message;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    return {
      type: InputType.SELECT_OPTION,
      options: [CONFIRM_ALL_PLAYERS_GAIN, SKIP_ALL_PLAYERS_GAIN],
      message: this.message,
    };
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const selected = (response as any)?.selectedOption as string | undefined;
    if (selected === SKIP_ALL_PLAYERS_GAIN) {
      return undefined;
    }
    if (selected !== CONFIRM_ALL_PLAYERS_GAIN) {
      return this.execute(game);
    }
    for (const p of game.players) {
      p.addFood(this.food);
    }
    return undefined;
  }
}

