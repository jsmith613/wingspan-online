import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import { HabitatType } from '../../../common/game/HabitatType';
import type { Player } from '../../Player';

/** Points for birds in grassland habitat. */
export class BackyardBirder extends BonusCard {
  readonly name = BonusCardName.BACKYARD_BIRDER;
  readonly displayName = 'Backyard Birder';
  readonly description = '1 point for each bird in your grassland habitat.';

  score(player: Player): number {
    return player.board.getBirdCount(HabitatType.GRASSLAND);
  }
}
