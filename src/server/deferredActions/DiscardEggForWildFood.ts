import { FoodType } from '../../common/game/FoodType';
import { BirdCardName } from '../../common/cards/BirdCardName';
import { InputType } from '../../common/input/InputType';
import type { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { Player } from '../Player';
import { ActionPriority, DeferredAction } from './DeferredAction';

const CONFIRM_DISCARD_EGG_GAIN_WILD = 'CONFIRM_DISCARD_EGG_GAIN_WILD';
const SKIP_DISCARD_EGG_GAIN_WILD = 'SKIP_DISCARD_EGG_GAIN_WILD';

type Phase = 'choose' | 'pickEgg' | 'pickFood';

export class DiscardEggForWildFood extends DeferredAction {
  private readonly gainCount: number;
  private readonly message: string;
  private phase: Phase = 'choose';
  private remainingGain: number;

  constructor(player: Player, gainCount: number, message: string) {
    super(player, ActionPriority.DEFAULT);
    this.gainCount = gainCount;
    this.remainingGain = gainCount;
    this.message = message;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    const canConfirm = this.getEggBirds().length > 0;
    return {
      type: InputType.SELECT_OPTION,
      options: [CONFIRM_DISCARD_EGG_GAIN_WILD, SKIP_DISCARD_EGG_GAIN_WILD],
      disabledOptions: canConfirm ? [] : [CONFIRM_DISCARD_EGG_GAIN_WILD],
      message: canConfirm ? this.message : `${this.message} (No eggs to discard)`,
    };
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    if (this.phase === 'choose') {
      const selected = (response as any)?.selectedOption as string | undefined;
      if (selected === SKIP_DISCARD_EGG_GAIN_WILD) return undefined;
      if (selected !== CONFIRM_DISCARD_EGG_GAIN_WILD || this.getEggBirds().length === 0) {
        return this.execute(game);
      }
      this.phase = 'pickEgg';
      return this.askEggBird();
    }

    if (this.phase === 'pickEgg') {
      const placements = (response as any)?.placements as Record<string, number> | undefined;
      const chosenName = placements
        ? Object.keys(placements).find((k) => (placements[k] ?? 0) > 0)
        : undefined;
      if (!chosenName) return this.askEggBird();
      const bird = this.getEggBirds().find((b) => b.name === chosenName);
      if (!bird) return this.askEggBird();
      bird.eggs--;
      this.phase = 'pickFood';
      return this.askFood();
    }

    const selectedFood = (response as any)?.selectedOption as FoodType | undefined;
    if (!selectedFood || !this.isBaseFood(selectedFood)) {
      return this.askFood();
    }
    this.player.addFood(selectedFood);
    this.remainingGain--;
    if (this.remainingGain <= 0) return undefined;
    return this.askFood();
  }

  private askEggBird(): PlayerInputModel {
    return {
      type: InputType.SELECT_EGG_LOCATION,
      availableBirds: this.getEggBirds().map((b) => b.name as BirdCardName),
      eggsToLay: 1,
    };
  }

  private askFood(): PlayerInputModel {
    return {
      type: InputType.SELECT_OPTION,
      options: [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.FISH, FoodType.FRUIT, FoodType.RODENT],
      message: `Choose wild food (${this.gainCount - this.remainingGain + 1} of ${this.gainCount}).`,
    };
  }

  private getEggBirds() {
    return this.player.board.getAllBirds().filter((b) => b.eggs > 0);
  }

  private isBaseFood(food: FoodType): boolean {
    return food !== FoodType.WILD;
  }
}
