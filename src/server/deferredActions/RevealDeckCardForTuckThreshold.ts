import type { BirdCardName } from '../../common/cards/BirdCardName';
import { InputType } from '../../common/input/InputType';
import type { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { PlacedBird } from '../habitats/PlayerBoard';
import type { Player } from '../Player';
import { ActionPriority, DeferredAction } from './DeferredAction';

const REVEAL_CARD = 'REVEAL_CARD';
const SKIP_REVEAL = 'SKIP_REVEAL';
const TUCK_REVEALED = 'TUCK_REVEALED';
const DISCARD_REVEALED = 'DISCARD_REVEALED';

type Phase = 'choose' | 'result';

export class RevealDeckCardForTuckThreshold extends DeferredAction {
  private readonly targetBird: PlacedBird;
  private readonly thresholdCm: number;
  private readonly birdName: string;
  private phase: Phase = 'choose';
  private revealedCard: BirdCardName | null = null;
  private canTuck: boolean = false;
  private revealSummary: string = '';
  private revealedCardDetails: any[] = [];

  constructor(player: Player, targetBird: PlacedBird, thresholdCm: number, birdName: string) {
    super(player, ActionPriority.DEFAULT);
    this.targetBird = targetBird;
    this.thresholdCm = thresholdCm;
    this.birdName = birdName;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    return {
      type: InputType.SELECT_OPTION,
      options: [REVEAL_CARD, SKIP_REVEAL],
      message: `${this.birdName}: Reveal Card?`,
    };
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const selectedOption = (response as any)?.selectedOption as string | undefined;
    if (this.phase === 'choose') {
      if (selectedOption === SKIP_REVEAL) {
        return undefined;
      }
      if (selectedOption !== REVEAL_CARD) {
        return this.execute(game);
      }

      this.revealedCard = game.drawFromDeck();
      this.revealedCardDetails = [];
      if (!this.revealedCard) {
        this.canTuck = false;
        this.revealSummary = 'No card was revealed.';
      } else {
        const revealed = game.createBirdCardInstance(this.revealedCard);
        if (revealed) {
          this.revealSummary = `${revealed.commonName} (${revealed.wingspan}cm)`;
          this.canTuck = revealed.wingspan < this.thresholdCm;
          this.revealedCardDetails = [revealed.toClientCard()];
        } else {
          this.revealSummary = String(this.revealedCard);
          this.canTuck = false;
        }
      }

      this.phase = 'result';
      return this.resultPrompt();
    }

    if (this.canTuck) {
      if (selectedOption !== TUCK_REVEALED) {
        return this.resultPrompt();
      }
      this.targetBird.tuckedCards++;
      return undefined;
    }

    if (selectedOption !== DISCARD_REVEALED) {
      return this.resultPrompt();
    }
    if (this.revealedCard) {
      game.discardBirdCard(this.revealedCard);
    }
    return undefined;
  }

  private resultPrompt(): PlayerInputModel {
    if (this.canTuck) {
      return {
        type: InputType.SELECT_OPTION,
        options: [TUCK_REVEALED],
        message: `Success! Revealed ${this.revealSummary}.`,
        cardDetails: this.revealedCardDetails,
      };
    }

    return {
      type: InputType.SELECT_OPTION,
      options: [DISCARD_REVEALED],
      message: `No Luck. Revealed ${this.revealSummary}.`,
      cardDetails: this.revealedCardDetails,
    };
  }
}
