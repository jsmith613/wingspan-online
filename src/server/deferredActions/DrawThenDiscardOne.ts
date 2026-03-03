import { InputType } from '../../common/input/InputType';
import type { BirdCardName } from '../../common/cards/BirdCardName';
import type { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { Player } from '../Player';
import { ActionPriority, DeferredAction } from './DeferredAction';

const CONFIRM_DRAW_DISCARD = 'CONFIRM_DRAW_DISCARD';
const SKIP_DRAW_DISCARD = 'SKIP_DRAW_DISCARD';

type Phase = 'choose' | 'discard';

export class DrawThenDiscardOne extends DeferredAction {
  private readonly drawCount: number;
  private readonly message: string;
  private phase: Phase = 'choose';

  constructor(player: Player, drawCount: number, message: string) {
    super(player, ActionPriority.DEFAULT);
    this.drawCount = drawCount;
    this.message = message;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    return {
      type: InputType.SELECT_OPTION,
      options: [CONFIRM_DRAW_DISCARD, SKIP_DRAW_DISCARD],
      message: this.message,
    };
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const selected = (response as any)?.selectedOption as string | undefined;

    if (this.phase === 'choose') {
      if (selected === SKIP_DRAW_DISCARD) {
        return undefined;
      }
      if (selected !== CONFIRM_DRAW_DISCARD) {
        return this.execute(game);
      }

      for (let i = 0; i < this.drawCount; i++) {
        const card = game.drawFromDeck();
        if (card) this.player.addCardToHand(card);
      }

      if (this.player.hand.length === 0) {
        return undefined;
      }

      this.phase = 'discard';
      return this.askDiscard();
    }

    const selectedCards = Array.isArray((response as any)?.selectedCards)
      ? ((response as any).selectedCards as BirdCardName[])
      : [];
    if (selectedCards.length !== 1) {
      return this.askDiscard();
    }

    const idx = this.player.hand.indexOf(selectedCards[0]);
    if (idx === -1) {
      return this.askDiscard();
    }
    this.player.hand.splice(idx, 1);
    return undefined;
  }

  private askDiscard(): PlayerInputModel {
    return {
      type: InputType.SELECT_CARDS,
      availableCards: [...this.player.hand],
      message: 'Discard 1 card from your hand.',
      min: 1,
      max: 1,
    };
  }
}

