import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';

/** Points for birds with cached food. */
export class EnclosureBuilder extends BonusCard {
  readonly name = BonusCardName.ENCLOSURE_BUILDER;
  readonly displayName = 'Enclosure Builder';
  readonly description = '2 points for each bird with cached food.';

  score(player: Player): number {
    return player.board.getAllBirds().filter(b => b.cachedFood > 0).length * 2;
  }
}
