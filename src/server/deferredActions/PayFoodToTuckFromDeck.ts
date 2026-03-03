import { FoodType } from '../../common/game/FoodType';
import { InputType } from '../../common/input/InputType';
import type { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { PlacedBird } from '../habitats/PlayerBoard';
import type { Player } from '../Player';
import { ActionPriority, DeferredAction } from './DeferredAction';

const CONFIRM_PAY_TUCK = 'CONFIRM_PAY_TUCK';
const SKIP_PAY_TUCK = 'SKIP_PAY_TUCK';
const CONFIRM_TUCK_RESULT = 'CONFIRM_TUCK_RESULT';

type Phase = 'choose' | 'result';

export class PayFoodToTuckFromDeck extends DeferredAction {
  private readonly costFood: FoodType;
  private readonly tuckCount: number;
  private readonly targetBird: PlacedBird;
  private readonly message: string;
  private phase: Phase = 'choose';
  private tucked = 0;

  constructor(player: Player, targetBird: PlacedBird, costFood: FoodType, tuckCount: number, message: string) {
    super(player, ActionPriority.DEFAULT);
    this.targetBird = targetBird;
    this.costFood = costFood;
    this.tuckCount = tuckCount;
    this.message = message;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    const canConfirm = this.player.food.includes(this.costFood);
    return {
      type: InputType.SELECT_OPTION,
      options: [CONFIRM_PAY_TUCK, SKIP_PAY_TUCK],
      disabledOptions: canConfirm ? [] : [CONFIRM_PAY_TUCK],
      message: canConfirm ? this.message : `${this.message} (Missing required food)`,
    };
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const selected = (response as any)?.selectedOption as string | undefined;
    if (this.phase === 'choose') {
      if (selected === SKIP_PAY_TUCK) return undefined;
      if (selected !== CONFIRM_PAY_TUCK) return this.execute(game);

      const idx = this.player.food.indexOf(this.costFood);
      if (idx === -1) return this.execute(game);
      this.player.food.splice(idx, 1);

      for (let i = 0; i < this.tuckCount; i++) {
        const card = game.drawFromDeck();
        if (!card) break;
        this.targetBird.tuckedCards++;
        this.tucked++;
      }
      this.phase = 'result';
      return {
        type: InputType.SELECT_OPTION,
        options: [CONFIRM_TUCK_RESULT],
        message: `Tucked ${this.tucked} card${this.tucked === 1 ? '' : 's'} from the deck.`,
      };
    }

    if (selected !== CONFIRM_TUCK_RESULT) {
      return {
        type: InputType.SELECT_OPTION,
        options: [CONFIRM_TUCK_RESULT],
        message: `Tucked ${this.tucked} card${this.tucked === 1 ? '' : 's'} from the deck.`,
      };
    }
    return undefined;
  }
}

