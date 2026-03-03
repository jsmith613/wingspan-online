import { InputType } from '../../common/input/InputType';
import { FoodType } from '../../common/game/FoodType';
import type { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { PlacedBird } from '../habitats/PlayerBoard';
import type { Player } from '../Player';
import { ActionPriority, DeferredAction } from './DeferredAction';

const ROLL_OUTSIDE = 'ROLL_OUTSIDE';
const SKIP_ROLL = 'SKIP_ROLL';
const CACHE_RESULT = 'CACHE_RESULT';
const CONFIRM_RESULT = 'CONFIRM_RESULT';

type Phase = 'choose' | 'result';

function foodLabel(food: FoodType): string {
  switch (food) {
    case FoodType.FISH:
      return 'fish';
    case FoodType.RODENT:
      return 'rodent';
    case FoodType.SEED:
      return 'seed';
    case FoodType.FRUIT:
      return 'fruit';
    case FoodType.INVERTEBRATE:
      return 'invertebrate';
    case FoodType.WILD:
      return 'wild';
  }
}

export class RollOutsideBirdfeederForCache extends DeferredAction {
  private readonly targetBird: PlacedBird;
  private readonly wantedFood: FoodType;
  private readonly birdName: string;
  private phase: Phase = 'choose';
  private rolled: FoodType[] = [];
  private success: boolean = false;

  constructor(player: Player, targetBird: PlacedBird, wantedFood: FoodType, birdName: string) {
    super(player, ActionPriority.DEFAULT);
    this.targetBird = targetBird;
    this.wantedFood = wantedFood;
    this.birdName = birdName;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    return this.askChoice();
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const selectedOption = (response as any)?.selectedOption as string | undefined;
    if (this.phase === 'choose') {
      if (selectedOption === SKIP_ROLL) {
        return undefined;
      }
      if (selectedOption !== ROLL_OUTSIDE) {
        return this.askChoice();
      }

      this.rolled = game.birdfeeder.rollOutsideDice();
      this.success = this.rolled.includes(this.wantedFood);
      this.phase = 'result';
      return this.askResult();
    }

    if (this.success) {
      if (selectedOption !== CACHE_RESULT) {
        return this.askResult();
      }
      this.targetBird.cachedFood++;
      return undefined;
    }

    if (selectedOption !== CONFIRM_RESULT) {
      return this.askResult();
    }
    return undefined;
  }

  private askChoice(): PlayerInputModel {
    return {
      type: InputType.SELECT_OPTION,
      options: [ROLL_OUTSIDE, SKIP_ROLL],
      message: `${this.birdName}: roll all dice not in the birdfeeder?`,
    };
  }

  private askResult(): PlayerInputModel {
    const rolledText = this.rolled.length > 0
      ? this.rolled.map(foodLabel).join(', ')
      : 'no dice were outside the birdfeeder';

    return {
      type: InputType.SELECT_OPTION,
      options: [this.success ? CACHE_RESULT : CONFIRM_RESULT],
      message: this.success
        ? `Success! Rolled: ${rolledText}. Cache 1 ${foodLabel(this.wantedFood)}.`
        : `No Luck. Rolled: ${rolledText}.`,
    };
  }
}

