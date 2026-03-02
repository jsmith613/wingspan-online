import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';

export class BreedingManager extends BonusCard {
  readonly name = BonusCardName.BREEDING_MANAGER;
  readonly displayName = 'Breeding Manager';
  readonly description = 'Birds with at least 4 eggs on them.';
  readonly condition = 'Bird has 4 or more eggs';
  readonly vpText = '1pt per bird';

  score(player: Player): number {
    return player.board.getAllBirds().filter(b => b.eggs >= 4).length;
  }
}
