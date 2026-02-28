import { DeferredAction, ActionPriority } from './DeferredAction';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import { InputType } from '../../common/input/InputType';
import { BirdCardName } from '../../common/cards/BirdCardName';
import { PlacedBird } from '../habitats/PlayerBoard';

/**
 * Tuck a card from hand behind a bird on the board.
 */
export class TuckCard extends DeferredAction {
  private readonly targetBird: PlacedBird | null;
  private readonly count: number;

  constructor(player: Player, count: number = 1, targetBird: PlacedBird | null = null) {
    super(player, ActionPriority.DEFAULT);
    this.count = count;
    this.targetBird = targetBird;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    if (this.player.hand.length === 0) {
      return undefined;
    }
    if (this.targetBird) {
      // Tuck from hand to specific bird
      return this.askForCardToTuck();
    }
    return this.askForCardToTuck();
  }

  handleInput(_game: Game, response: unknown): PlayerInputModel | undefined {
    const cardName = response as BirdCardName;
    const idx = this.player.hand.indexOf(cardName);
    if (idx !== -1) {
      this.player.hand.splice(idx, 1);
      if (this.targetBird) {
        this.targetBird.tuckedCards++;
      }
    }
    return undefined;
  }

  private askForCardToTuck(): PlayerInputModel | undefined {
    if (this.player.hand.length === 0) {
      return undefined;
    }
    return {
      type: InputType.SELECT_CARDS,
      availableCards: [...this.player.hand],
      min: 0,
      max: this.count,
    };
  }
}
