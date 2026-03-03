import { InputType } from '../../common/input/InputType';
import type { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { Player } from '../Player';
import { ActionPriority, DeferredAction } from './DeferredAction';

const CONFIRM_ALL_PLAYERS_DRAW = 'CONFIRM_ALL_PLAYERS_DRAW';
const SKIP_ALL_PLAYERS_DRAW = 'SKIP_ALL_PLAYERS_DRAW';

export class AllPlayersDrawFromDeck extends DeferredAction {
  private readonly count: number;
  private readonly message: string;

  constructor(player: Player, count: number, message: string) {
    super(player, ActionPriority.DEFAULT);
    this.count = count;
    this.message = message;
  }

  execute(_game: Game): PlayerInputModel | undefined {
    return {
      type: InputType.SELECT_OPTION,
      options: [CONFIRM_ALL_PLAYERS_DRAW, SKIP_ALL_PLAYERS_DRAW],
      message: this.message,
    };
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const selected = (response as any)?.selectedOption as string | undefined;
    if (selected === SKIP_ALL_PLAYERS_DRAW) {
      return undefined;
    }
    if (selected !== CONFIRM_ALL_PLAYERS_DRAW) {
      return this.execute(game);
    }
    for (const p of game.players) {
      for (let i = 0; i < this.count; i++) {
        const card = game.drawFromDeck();
        if (card) p.addCardToHand(card);
      }
    }
    return undefined;
  }
}

