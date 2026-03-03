import { InputType } from '../../common/input/InputType';
import { HabitatType } from '../../common/game/HabitatType';
import type { PlayerInputModel } from '../../common/input/PlayerInputModel';
import type { Game } from '../Game';
import type { Player } from '../Player';
import { ActionPriority, DeferredAction } from './DeferredAction';

const CONFIRM_FEWEST_WETLAND_DRAW = 'CONFIRM_FEWEST_WETLAND_DRAW';
const SKIP_FEWEST_WETLAND_DRAW = 'SKIP_FEWEST_WETLAND_DRAW';

export class FewestWetlandPlayersDraw extends DeferredAction {
  private readonly drawCount: number;
  private readonly message: string;

  constructor(player: Player, drawCount: number, message: string) {
    super(player, ActionPriority.DEFAULT);
    this.drawCount = drawCount;
    this.message = message;
  }

  execute(game: Game): PlayerInputModel | undefined {
    const eligible = this.getEligiblePlayers(game);
    return {
      type: InputType.SELECT_OPTION,
      options: [CONFIRM_FEWEST_WETLAND_DRAW, SKIP_FEWEST_WETLAND_DRAW],
      disabledOptions: eligible.length > 0 ? [] : [CONFIRM_FEWEST_WETLAND_DRAW],
      message: eligible.length > 0 ? this.message : `${this.message} (No eligible players)`,
    };
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    const selected = (response as any)?.selectedOption as string | undefined;
    if (selected === SKIP_FEWEST_WETLAND_DRAW) return undefined;
    if (selected !== CONFIRM_FEWEST_WETLAND_DRAW) return this.execute(game);

    const eligible = this.getEligiblePlayers(game);
    for (const p of eligible) {
      for (let i = 0; i < this.drawCount; i++) {
        const card = game.drawFromDeck();
        if (card) p.addCardToHand(card);
      }
    }
    return undefined;
  }

  private getEligiblePlayers(game: Game): Player[] {
    const counts = game.players.map((p) => ({
      player: p,
      count: p.board.getBirdCount(HabitatType.WETLAND),
    }));
    if (counts.length === 0) return [];
    const min = Math.min(...counts.map((c) => c.count));
    return counts.filter((c) => c.count === min).map((c) => c.player);
  }
}

