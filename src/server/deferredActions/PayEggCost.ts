import { DeferredAction, ActionPriority } from './DeferredAction';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import { InputType } from '../../common/input/InputType';
import { BirdCardName } from '../../common/cards/BirdCardName';

/**
 * Pay an egg cost by removing eggs from birds on the board.
 * Player chooses which birds to take eggs from.
 */
export class PayEggCost extends DeferredAction {
  private readonly eggCount: number;

  constructor(player: Player, eggCount: number) {
    super(player, ActionPriority.COST);
    this.eggCount = eggCount;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    if (this.eggCount === 0) {
      return undefined;
    }
    return this.askForEggSource();
  }

  handleInput(_game: Game, response: unknown): PlayerInputModel | undefined {
    const selections = response as Array<{ bird: string; count: number }>;
    for (const sel of selections) {
      const bird = this.player.board.getAllBirds().find(b => b.name === sel.bird);
      if (bird && bird.eggs >= sel.count) {
        bird.eggs -= sel.count;
      }
    }
    return undefined;
  }

  private askForEggSource(): PlayerInputModel | undefined {
    const birdsWithEggs = this.player.board.getAllBirds()
      .filter(b => b.eggs > 0);
    if (birdsWithEggs.length === 0) {
      return undefined;
    }
    return {
      type: InputType.SELECT_EGG_LOCATION,
      availableBirds: birdsWithEggs.map(b => b.name as BirdCardName),
      eggsToLay: this.eggCount, // reusing field to indicate eggs needed
    };
  }
}
