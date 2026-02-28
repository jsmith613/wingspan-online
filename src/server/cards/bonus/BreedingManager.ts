import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';

/** Points for birds with at least 1 egg. */
export class BreedingManager extends BonusCard {
  readonly name = BonusCardName.BREEDING_MANAGER;
  readonly displayName = 'Breeding Manager';
  readonly description = '1 point for each bird that has at least 1 egg on it.';

  score(player: Player): number {
    return player.board.getAllBirds().filter(b => b.eggs > 0).length;
  }
}
