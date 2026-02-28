import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import { HabitatType } from '../../../common/game/HabitatType';
import type { Player } from '../../Player';

/** Points based on how evenly birds are distributed across habitats. */
export class Ecologist extends BonusCard {
  readonly name = BonusCardName.ECOLOGIST;
  readonly displayName = 'Ecologist';
  readonly description = '3 points for each habitat with at least 3 birds.';

  score(player: Player): number {
    let count = 0;
    for (const habitat of Object.values(HabitatType)) {
      if (player.board.getBirdCount(habitat) >= 3) {
        count++;
      }
    }
    return count * 3;
  }
}
