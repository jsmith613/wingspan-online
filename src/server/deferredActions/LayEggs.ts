import { DeferredAction, ActionPriority } from './DeferredAction';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import { InputType } from '../../common/input/InputType';
import { MAX_EGGS_PER_BIRD } from '../../common/constants';
import { BirdCardName } from '../../common/cards/BirdCardName';

/**
 * Lay eggs on birds. Player chooses which birds get eggs.
 */
export class LayEggs extends DeferredAction {
  private readonly count: number;

  constructor(player: Player, count: number) {
    super(player, ActionPriority.GAIN);
    this.count = count;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    return this.askForEggLocation();
  }

  handleInput(_game: Game, response: unknown): PlayerInputModel | undefined {
    const input = response as any;
    // Client sends { placements: { birdName: count } }
    const placements: Record<string, number> = input.placements || {};
    for (const [birdName, count] of Object.entries(placements)) {
      const bird = this.player.board.getAllBirds().find(b => b.name === birdName);
      if (bird && bird.eggs < MAX_EGGS_PER_BIRD) {
        const toAdd = Math.min(count as number, MAX_EGGS_PER_BIRD - bird.eggs);
        bird.eggs += toAdd;
      }
    }
    return undefined;
  }

  private askForEggLocation(): PlayerInputModel | undefined {
    const birds = this.player.board.getAllBirds()
      .filter(b => b.eggs < MAX_EGGS_PER_BIRD);
    // Always show the prompt so the user can back out or confirm 0 eggs
    return {
      type: InputType.SELECT_EGG_LOCATION,
      availableBirds: birds.map(b => b.name as BirdCardName),
      eggsToLay: birds.length === 0 ? 0 : this.count,
    };
  }
}
