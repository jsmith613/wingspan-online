import { DeferredAction, ActionPriority } from './DeferredAction';
import type { Player } from '../Player';
import type { Game } from '../Game';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import { InputType } from '../../common/input/InputType';
import { BirdCardName } from '../../common/cards/BirdCardName';
import { PlacedBird } from '../habitats/PlayerBoard';

interface TuckCardOptions {
  readonly targetBird: PlacedBird;
  readonly count?: number;
  readonly min?: number;
  readonly message?: string;
  readonly onTucked?: (count: number, game: Game) => void;
}

/**
 * Tuck a card from hand behind a bird on the board.
 */
export class TuckCard extends DeferredAction {
  private readonly targetBird: PlacedBird;
  private readonly count: number;
  private readonly min: number;
  private readonly message?: string;
  private readonly onTucked?: (count: number, game: Game) => void;

  constructor(player: Player, options: TuckCardOptions) {
    super(player, ActionPriority.DEFAULT);
    this.targetBird = options.targetBird;
    this.count = options.count ?? 1;
    this.min = options.min ?? 0;
    this.message = options.message;
    this.onTucked = options.onTucked;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    if (this.player.hand.length === 0) {
      return undefined;
    }
    return this.askForCardToTuck();
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const input = response as any;
    const selected = Array.isArray(input?.selectedCards)
      ? (input.selectedCards as BirdCardName[])
      : (typeof response === 'string' ? [response as BirdCardName] : []);

    let tucked = 0;
    for (const cardName of selected.slice(0, this.count)) {
      const idx = this.player.hand.indexOf(cardName);
      if (idx !== -1) {
        this.player.hand.splice(idx, 1);
        this.targetBird.tuckedCards++;
        tucked++;
      }
    }

    if (tucked > 0) {
      this.onTucked?.(tucked, game);
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
      message: this.message,
      min: this.min,
      max: this.count,
    };
  }
}
