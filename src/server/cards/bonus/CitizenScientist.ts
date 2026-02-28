import { BonusCard } from '../BonusCard';
import { BonusCardName } from '../../../common/cards/BonusCardName';
import { HabitatType } from '../../../common/game/HabitatType';
import type { Player } from '../../Player';

/** Points based on the minimum birds across all habitats. */
export class CitizenScientist extends BonusCard {
  readonly name = BonusCardName.CITIZEN_SCIENTIST;
  readonly displayName = 'Citizen Scientist';
  readonly description = '2 points for each column with a bird in every habitat row.';

  score(player: Player): number {
    const forest = player.board.getBirdCount(HabitatType.FOREST);
    const grassland = player.board.getBirdCount(HabitatType.GRASSLAND);
    const wetland = player.board.getBirdCount(HabitatType.WETLAND);
    return Math.min(forest, grassland, wetland) * 2;
  }
}
