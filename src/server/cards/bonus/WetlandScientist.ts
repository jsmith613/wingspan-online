import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import { HabitatType } from '../../../common/game/HabitatType';
import type { Player } from '../../Player';

/** Points for birds in wetland habitat. */
export class WetlandScientist extends BonusCard {
  readonly name = BonusCardName.WETLAND_SCIENTIST;
  readonly displayName = 'Wetland Scientist';
  readonly description = '1 point for each bird in your wetland habitat.';

  score(player: Player): number {
    return player.board.getBirdCount(HabitatType.WETLAND);
  }
}
