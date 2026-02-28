import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';

/** Points for tucked cards. */
export class BirdBander extends BonusCard {
  readonly name = BonusCardName.BIRD_BANDER;
  readonly displayName = 'Bird Bander';
  readonly description = '1 point for each bird with a tucked card behind it.';

  score(player: Player): number {
    return player.board.getAllBirds().filter(b => b.tuckedCards > 0).length;
  }
}
