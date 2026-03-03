import type { Game } from '../Game';
import type { Player } from '../Player';
import type { BirdCard, BrownPowerContext } from '../cards/BirdCard';
import { DeferredAction, ActionPriority } from './DeferredAction';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';

/**
 * Executes a single bird's brown power as part of a habitat activation chain.
 * Kept as a deferred action so queue ordering can enforce right-to-left timing.
 */
export class ActivateBrownPower extends DeferredAction {
  private readonly card: BirdCard;
  private readonly context: BrownPowerContext;

  constructor(player: Player, card: BirdCard, context: BrownPowerContext = {}) {
    super(player, ActionPriority.PINK_POWER);
    this.card = card;
    this.context = context;
  }

  isCancellationLocked(): boolean {
    return true;
  }

  execute(game: Game): PlayerInputModel | undefined {
    this.card.onActivate(this.player, game, this.context);
    return undefined;
  }

  handleInput(game: Game, response: unknown): PlayerInputModel | undefined {
    void game;
    void response;
    return undefined;
  }
}
