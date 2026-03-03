import { BonusCardName } from '../../common/cards/BonusCardName';
import { InputType } from '../../common/input/InputType';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { Player } from '../Player';
import { DeferredAction, ActionPriority } from './DeferredAction';

/**
 * Draw N bonus cards and keep K of them.
 * Unkept cards are discarded from this temporary selection.
 */
export class DrawBonusCardsKeepOne extends DeferredAction {
  private readonly drawCount: number;
  private readonly keepCount: number;
  private drawnCards: BonusCardName[] = [];

  constructor(player: Player, drawCount: number = 2, keepCount: number = 1) {
    super(player, ActionPriority.DEFAULT);
    this.drawCount = drawCount;
    this.keepCount = keepCount;
  }

  isCancellationLocked(): boolean {
    return true;
  }

  execute(game: Game): PlayerInputModel | undefined {
    this.drawnCards = [];
    for (let i = 0; i < this.drawCount; i++) {
      const card = game.drawBonusCard();
      if (!card) break;
      this.drawnCards.push(card);
    }

    if (this.drawnCards.length === 0) {
      return undefined;
    }

    if (this.drawnCards.length <= this.keepCount) {
      this.player.bonusCards.push(...this.drawnCards);
      this.drawnCards = [];
      return undefined;
    }

    return this.buildPrompt();
  }

  handleInput(_game: Game, response: unknown): PlayerInputModel | undefined {
    const selected = ((response as any)?.selectedBonusCards || []) as BonusCardName[];
    if (
      !Array.isArray(selected) ||
      selected.length !== this.keepCount ||
      !selected.every((c) => this.drawnCards.includes(c))
    ) {
      return this.buildPrompt();
    }

    this.player.bonusCards.push(...selected);
    this.drawnCards = [];
    return undefined;
  }

  private buildPrompt(): PlayerInputModel {
    return {
      type: InputType.SELECT_BONUS_CARD,
      availableBonusCards: [...this.drawnCards],
      min: this.keepCount,
      max: this.keepCount,
    };
  }
}

