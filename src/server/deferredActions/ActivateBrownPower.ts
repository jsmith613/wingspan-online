import type { Game } from '../Game';
import type { Player } from '../Player';
import type { BirdCard } from '../cards/BirdCard';
import { DeferredAction, ActionPriority } from './DeferredAction';
import { PlayerInputModel } from '../../common/input/PlayerInputModel';

/**
 * Executes a single bird's brown power as part of a habitat activation chain.
 * Kept as a deferred action so queue ordering can enforce right-to-left timing.
 */
export class ActivateBrownPower extends DeferredAction {
  private readonly card: BirdCard;

  constructor(player: Player, card: BirdCard) {
    super(player, ActionPriority.PINK_POWER);
    this.card = card;
  }

  isCancellationLocked(): boolean {
    return true;
  }

  execute(game: Game): PlayerInputModel | undefined {
    this.card.onActivate(this.player, game);
    return undefined;
  }
}
