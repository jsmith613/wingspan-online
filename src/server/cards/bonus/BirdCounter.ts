import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import type { Player } from '../../Player';

/** Points based on total number of birds played. */
export class BirdCounter extends BonusCard {
  readonly name = BonusCardName.BIRD_COUNTER;
  readonly displayName = 'Bird Counter';
  readonly description = '1 point for each bird in your play area.';

  score(player: Player): number {
    return player.board.getTotalBirdCount();
  }
}
