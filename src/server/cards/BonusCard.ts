import { BonusCardName } from '../../common/cards/BonusCardName';
import type { Player } from '../Player';

/**
 * Base class for all bonus cards.
 * Bonus cards score at end of game based on player state.
 */
export abstract class BonusCard {
  public abstract readonly name: BonusCardName;
  public abstract readonly displayName: string;
  public abstract readonly description: string;

  /**
   * Calculate the bonus points for a player at game end.
   */
  abstract score(player: Player): number;
}
