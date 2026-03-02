import { BonusCardName } from '../../common/cards/BonusCardName';
import { ClientBonusCard } from '../../common/cards/ClientBonusCard';
import type { Player } from '../Player';

/**
 * Base class for all bonus cards.
 * Bonus cards score at end of game based on player state.
 */
export abstract class BonusCard {
  public abstract readonly name: BonusCardName;
  public abstract readonly displayName: string;
  public abstract readonly description: string;
  public abstract readonly condition: string;
  public abstract readonly vpText: string;

  /**
   * Calculate the bonus points for a player at game end.
   */
  abstract score(player: Player): number;

  /**
   * Convert to client-facing bonus card with calculated score.
   */
  toClientCard(player: Player): ClientBonusCard {
    return {
      name: this.name,
      displayName: this.displayName,
      description: this.description,
      condition: this.condition,
      vpText: this.vpText,
      score: this.score(player),
    };
  }
}
