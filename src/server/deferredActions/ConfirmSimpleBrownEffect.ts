import { InputType } from '../../common/input/InputType';
import type { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { Player } from '../Player';
import { ActionPriority, DeferredAction } from './DeferredAction';

const CONFIRM_BROWN_EFFECT = 'CONFIRM_BROWN_EFFECT';
const SKIP_BROWN_EFFECT = 'SKIP_BROWN_EFFECT';

export class ConfirmSimpleBrownEffect extends DeferredAction {
  private readonly message: string;
  private readonly onConfirm: (game: Game) => void;
  private readonly canConfirm: boolean;
  private readonly disabledReason?: string;

  constructor(
    player: Player,
    message: string,
    onConfirm: (game: Game) => void,
    canConfirm: boolean = true,
    disabledReason?: string,
  ) {
    super(player, ActionPriority.DEFAULT);
    this.message = message;
    this.onConfirm = onConfirm;
    this.canConfirm = canConfirm;
    this.disabledReason = disabledReason;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    return {
      type: InputType.SELECT_OPTION,
      options: [CONFIRM_BROWN_EFFECT, SKIP_BROWN_EFFECT],
      disabledOptions: this.canConfirm ? [] : [CONFIRM_BROWN_EFFECT],
      message: this.canConfirm || !this.disabledReason
        ? this.message
        : `${this.message} (${this.disabledReason})`,
    };
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const selected = (response as any)?.selectedOption as string | undefined;
    if (selected === SKIP_BROWN_EFFECT) {
      return undefined;
    }
    if (!this.canConfirm) {
      return this.execute(game);
    }
    if (selected !== CONFIRM_BROWN_EFFECT) {
      return this.execute(game);
    }
    this.onConfirm(game);
    return undefined;
  }
}
